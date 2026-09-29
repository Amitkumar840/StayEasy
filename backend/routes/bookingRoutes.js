import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/", protect, authorize("staff", "admin"), getAllBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/status", protect, authorize("staff", "admin"), updateBookingStatus);
router.post("/:id/cancel", protect, cancelBooking);

export default router;
