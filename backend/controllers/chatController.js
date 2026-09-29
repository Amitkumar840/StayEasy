import { processChatMessage, getChatHistory } from "../services/aiService.js";
import {
  executeBookingCreation,
  executeBookingCancellation,
  executeComplaintCreation,
} from "../ai/chatbot/chatbot.js";
import { sendSuccess } from "utils/responseHandler.js";

export const sendChatMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      res.status(400);
      throw new Error("Message is required");
    }

    const { reply, intent, action } = await processChatMessage(req.user._id, message.trim());

    sendSuccess(res, 200, "Message processed successfully", { reply, intent, action });
  } catch (error) {
    next(error);
  }
};

export const getChatMessageHistory = async (req, res, next) => {
  try {
    const history = await getChatHistory(req.user._id);
    sendSuccess(res, 200, "Chat history fetched successfully", history);
  } catch (error) {
    next(error);
  }
};

export const confirmAIBooking = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut, guests } = req.body;

    if (!roomId || !checkIn || !checkOut || !guests) {
      res.status(400);
      throw new Error("roomId, checkIn, checkOut and guests are all required");
    }

    const booking = await executeBookingCreation({
      userId: req.user._id,
      roomId,
      checkIn,
      checkOut,
      guests,
    });

    sendSuccess(res, 201, "Booking confirmed and created", booking);
  } catch (error) {
    res.status(error.statusCode || 400);
    next(error);
  }
};

export const confirmAICancellation = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      res.status(400);
      throw new Error("bookingId is required");
    }

    const result = await executeBookingCancellation({
      userId: req.user._id,
      bookingId,
    });

    sendSuccess(res, 200, "Booking cancelled", result);
  } catch (error) {
    next(error);
  }
};

export const confirmAIComplaint = async (req, res, next) => {
  try {
    const { subject, description, category } = req.body;

    if (!subject || !description) {
      res.status(400);
      throw new Error("subject and description are required");
    }

    const complaint = await executeComplaintCreation({
      userId: req.user._id,
      subject,
      description,
      category,
    });

    sendSuccess(res, 201, "Complaint filed", complaint);
  } catch (error) {
    next(error);
  }
};