import User from "../models/User.js";
import { sendSuccess } from "utils/responseHandler.js";

const VALID_ROLES = ["customer", "staff", "admin"];

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    sendSuccess(res, 200, "Users fetched successfully", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    sendSuccess(res, 200, "User fetched successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const updates = {};

    if (role !== undefined) {
      if (!VALID_ROLES.includes(role)) {
        res.status(400);
        throw new Error("Invalid role");
      }
      updates.role = role;
    }

    if (isActive !== undefined) {
      updates.isActive = isActive;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    sendSuccess(res, 200, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { returnDocument: "after" }
    ).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    sendSuccess(res, 200, "User deactivated successfully", user);
  } catch (error) {
    next(error);
  }
};
