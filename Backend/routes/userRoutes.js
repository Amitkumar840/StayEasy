import express from "express";

import {
    getUserProfile,
    updateUserProfile,
    getAllUsers
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";


const router = express.Router();


// Get User Profile
router.get(
    "/profile",
    protect,
    getUserProfile
);


// Update User Profile
router.put(
    "/profile",
    protect,
    updateUserProfile
);


// Get All Users (Admin)
router.get(
    "/",
    protect,
    admin,
    getAllUsers
);


export default router;