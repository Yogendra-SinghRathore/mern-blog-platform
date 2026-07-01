import { Router } from "express";
import { registerUser,loginUser, logoutUser, refreshAccessToken, updateAvatar, verifyEmail, forgotPassword, resetPassword, getCurrentUser,  } from "../controllers/auth.controller.js"
import validateRequiredFields from "../middleware/validateRequiredFields.middleware.js";
import auth from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { loginLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post("/register", validateRequiredFields(["name", "email", "password"]) , registerUser);
router.post("/login", loginLimiter, validateRequiredFields(["email", "password"]), loginUser);
router.post("/logout",auth,logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.patch("/avatar", auth, upload.single("avatar"), updateAvatar );
router.get("/me", auth, getCurrentUser);

export default router;
