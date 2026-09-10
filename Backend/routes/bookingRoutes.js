import express from "express";

import {
    createBooking,
    getMyBookings,
    getAllBookings,
    cancelBooking
} from "../controllers/bookingController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";


const router = express.Router();


// Create Booking
router.post(
    "/",
    protect,
    createBooking
);


// Get User Bookings
router.get(
    "/my-bookings",
    protect,
    getMyBookings
);


// Get All Bookings (Admin)
router.get(
    "/",
    protect,
    admin,
    getAllBookings
);


// Cancel Booking
router.put(
    "/:id/cancel",
    protect,
    cancelBooking
);


export default router;