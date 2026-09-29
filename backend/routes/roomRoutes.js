import express from "express";
import {
  getRooms,
  getAvailableRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  uploadRoomImage,
  deleteRoomImage,
} from "../controllers/roomController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getRooms);
router.get("/available", getAvailableRooms);
router.get("/:id", getRoomById);

router.post("/", protect, authorize("admin"), createRoom);
router.put("/:id", protect, authorize("admin"), updateRoom);
router.delete("/:id", protect, authorize("admin"), deleteRoom);

router.post(
  "/:id/images",
  protect,
  authorize("admin"),
  upload.single("image"),
  uploadRoomImage
);
router.delete("/:id/images", protect, authorize("admin"), deleteRoomImage);

export default router;