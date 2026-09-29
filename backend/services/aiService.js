import Message from "../models/Message.js";
import { getChatbotResponse } from "../ai/chatbot/chatbot.js";

export const processChatMessage = async (userId, userMessage) => {
  const recentMessages = await Message.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const conversationHistory = recentMessages.reverse();

  const { reply, intent, action } = await getChatbotResponse({
    userId,
    message: userMessage,
    conversationHistory,
  });

  await Message.create({ user: userId, sender: "user", message: userMessage, intent });
  await Message.create({ user: userId, sender: "ai", message: reply, intent });

  return { reply, intent, action };
};

export const getChatHistory = async (userId) => {
  return Message.find({ user: userId }).sort({ createdAt: 1 });
};