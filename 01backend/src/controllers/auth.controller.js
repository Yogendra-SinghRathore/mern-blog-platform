import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import cookieOptions from "../constants/cookieOptions.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
    });

    const verificationToken = user.generateEmailVerificationToken();

    await user.save();

    const verificationLink = `http://localhost:5173/verify-email/${verificationToken}`;

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      html: `<h2>Welcome ${user.name}</h2>

      <p>Please verify your email by clicking the link below.</p>

      <a href="${verificationLink}">
        Verify Email
      </a>

      <p>This link expires in 1 hour.</p>`,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        "User registered successfully. Please verify your email.",
      ),
    );
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(409, "Email already exists");
    }

    throw error;
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  return res
    .cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(new ApiResponse(200, null, "Login Successful"));
});

const logoutUser = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(401, "User not found");
  }

  user.refreshToken = null;

  await user.save();

  return res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new ApiError(401, "Unauthorized");
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }

    if (user.refreshToken !== refreshToken) {
      throw new ApiError(401, "Unauthorized");
    }

    const accessToken = user.generateAccessToken();

    return res
      .cookie("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      })
      .status(200)
      .json(new ApiResponse(200, null));
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Refresh token expired");
    }

    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid refresh token");
    }

    throw error;
  }
});

const updateAvatar = asyncHandler(async (req, res) => {
  const localFilePath = req.file?.path;

  if (!localFilePath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const uploadedFile = await uploadOnCloudinary(localFilePath);

  if (!uploadedFile) {
    throw new ApiError(500, "Error uploading avatar");
  }

  const updateUser = await User.findByIdAndUpdate(
    req.user.userId,
    { avatar: uploadedFile.secure_url },
    { returnDocument: "after" },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updateUser, "Avatar updated successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: token,
  });

  if (!user) {
    throw new ApiError(400, "Invalid verification link");
  }

  if (user.emailVerificationExpiry < Date.now()) {
    throw new ApiError(400, "Verification link has expired");
  }

  ((user.isVerified = true),
    (user.emailVerificationToken = null),
    (user.emailVerificationExpiry = null),
    await user.save());

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = user.generatePasswordResetToken();

  await user.save();

  const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password",
    html: `
      <h2>Hello ${user.name}</h2>

        <p>Click the link below to reset your password.</p>

        <a href="${resetLink}">
          Reset Password
        </a>

        <p>This link expires in 1 hour.</p>
    `,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "password reset link sent successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
  });

  if (!user) {
    throw new ApiError(400, "Invalid reset link");
  }

  if (user.passwordResetExpiry < Date.now()) {
    throw new ApiError(400, "Reset link has expired");
  }

  user.password = password;
  ((user.passwordResetToken = null),
    (user.passwordResetExpiry = null),
    await user.save());

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Current user fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updateAvatar,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getCurrentUser,
};
