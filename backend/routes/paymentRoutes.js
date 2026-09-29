import express from "express";
import { payForBooking } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, payForBooking);

export default router;