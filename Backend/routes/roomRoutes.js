import express from "express";

import {
    addRoom,
    getAllRooms,
    getRoomById,
    updateRoom,
    deleteRoom
} from "../controllers/roomController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";


const router = express.Router();


// Add Room (Admin)
router.post(
    "/",
    protect,
    admin,
    addRoom
);


// Get All Rooms
router.get(
    "/",
    getAllRooms
);


// Get Single Room
router.get(
    "/:id",
    getRoomById
);


// Update Room (Admin)
router.put(
    "/:id",
    protect,
    admin,
    updateRoom
);


// Delete Room (Admin)
router.delete(
    "/:id",
    protect,
    admin,
    deleteRoom
);


export default router;