import Message from "../models/Message.js";
import axios from "axios";


// Send Chat Message
export const sendMessage = async (req, res) => {
    try {

        const { message } = req.body;

        // Validate message
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required"
            });
        }

        // Save user's message
        const userChat = await Message.create({
            user: req.user.id,
            message: message,
            sender: "user"
        });

        // Send message to AI Service
        const aiResponse = await axios.post(
            `${process.env.AI_SERVICE_URL}/api/ai/chat`,
            {
                message: message,
                userId: req.user.id
            }
        );

        // Get AI response
        const aiReply = aiResponse.data.reply;

        // Save AI response
        const aiChat = await Message.create({
            user: req.user.id,
            message: aiReply,
            sender: "bot"
        });

        // Send response to frontend
        res.status(200).json({
            success: true,
            message: "Message processed successfully",
            reply: aiChat.message,
            userMessage: userChat,
            assistantMessage: aiChat
        });

    } catch (error) {

        console.error("Chat Controller Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to process chat message",
            error: error.message
        });

    }
};


// Get User Chat History
export const getChatHistory = async (req, res) => {
    try {

        const messages = await Message.find({
            user: req.user.id
        }).sort({
            createdAt: 1
        });

        res.status(200).json({
            success: true,
            messages
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};