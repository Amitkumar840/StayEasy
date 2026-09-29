import express from "express";
import {
  sendChatMessage,
  getChatMessageHistory,
  confirmAIBooking,
  confirmAICancellation,
  confirmAIComplaint,
} from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendChatMessage);
router.get("/history", protect, getChatMessageHistory);
router.post("/confirm-booking", protect, confirmAIBooking);
router.post("/confirm-cancel", protect, confirmAICancellation);
router.post("/confirm-complaint", protect, confirmAIComplaint);

export default router;