import express from "express";
import { getAdminStats } from "../controllers/analyticsController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/admin", protect, authorize("admin"), getAdminStats);

export default router;
