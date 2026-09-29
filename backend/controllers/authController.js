import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "utils/generateToken.js";
import { sendVerificationEmail } from "../services/emailService.js";
import { sendSuccess } from "utils/responseHandler.js";

const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};


export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword) {
      res.status(400);
      throw new Error("All fields are required");
    }

    if (password !== confirmPassword) {
      res.status(400);
      throw new Error("Passwords do not match");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }

    const code = generateVerificationCode();

    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "customer",
      isVerified: false,
      verificationCode: code,
      verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    await sendVerificationEmail(user, code);

    sendSuccess(res, 201, "Account created - please verify your email to continue", {
      email: user.email,
      requiresVerification: true,
    });
  } catch (error) {
    next(error);
  }
};


export const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      res.status(400);
      throw new Error("Email and code are both required");
    }

    const user = await User.findOne({ email }).select("+verificationCode +verificationCodeExpires");

    if (!user) {
      res.status(404);
      throw new Error("No account found with this email");
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error("This account is already verified");
    }

    if (!user.verificationCode || user.verificationCode !== code) {
      res.status(400);
      throw new Error("Invalid verification code");
    }

    if (user.verificationCodeExpires < new Date()) {
      res.status(400);
      throw new Error("This verification code has expired - please request a new one");
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    generateToken(res, user._id, user.role);

    sendSuccess(res, 200, "Email verified successfully", {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("No account found with this email");
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error("This account is already verified");
    }

    const code = generateVerificationCode();
    user.verificationCode = code;
    user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(user, code);

    sendSuccess(res, 200, "A new verification code has been sent", null);
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error("This account has been deactivated");
    }

    if (!user.isVerified) {
      res.status(403);
      throw new Error("Please verify your email before logging in");
    }

    generateToken(res, user._id, user.role);

    sendSuccess(res, 200, "Logged in successfully", {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    sendSuccess(res, 200, "Current user fetched", {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    sendSuccess(res, 200, "Logged out successfully", null);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (!name.trim()) {
        res.status(400);
        throw new Error("Name cannot be empty");
      }
      updates.name = name.trim();
    }

    if (phone !== undefined) {
      if (!phone.trim()) {
        res.status(400);
        throw new Error("Phone cannot be empty");
      }
      updates.phone = phone.trim();
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    sendSuccess(res, 200, "Profile updated successfully", {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

export const changeMyPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error("Current password and new password are both required");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters");
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.matchPassword(currentPassword))) {
      res.status(401);
      throw new Error("Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, "Password changed successfully", null);
  } catch (error) {
    next(error);
  }
};