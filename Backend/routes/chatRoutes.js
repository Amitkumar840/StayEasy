import express from "express";

import {
    sendMessage,
    getChatHistory
} from "../controllers/chatController.js";

import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();


// Send Chat Message
router.post(
    "/send",
    protect,
    sendMessage
);


// Get Chat History
router.get(
    "/history",
    protect,
    getChatHistory
);


export default router;