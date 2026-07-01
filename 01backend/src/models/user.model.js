import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },

    avatar: {
        type: String,
        default: "",
    },

    refreshToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken:{
        type: String,
        default: null,
    },
    emailVerificationExpiry:{
        type: Date,
        default: null,
    },
    passwordResetToken:{
        type: String,
    },
    passwordResetExpiry:{
        type: Date,
    }


},{timestamps:true});


userSchema.pre("save", async function () {
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            userId : this._id,
            type: "access"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );
};

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            userId : this._id,
            type: "refresh"
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "30d"
        }
    );
};

userSchema.methods.generateEmailVerificationToken = function(){
    const token = crypto.randomBytes(32).toString("hex");

    this.emailVerificationToken = token;
    this.emailVerificationExpiry = Date.now() + 60 * 60 * 1000;

    return token;
};

userSchema.methods.generatePasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex");

    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.passwordResetExpiry = Date.now() + 60 * 60 * 1000;

    return resetToken;
}


const User = mongoose.model("User", userSchema);

export default User;