import express from "express";
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  updateComplaint,
} from "../controllers/complaintController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/", protect, authorize("staff", "admin"), getAllComplaints);
router.put("/:id", protect, authorize("staff", "admin"), updateComplaint);

export default router;
