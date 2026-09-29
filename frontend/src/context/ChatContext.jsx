import { createContext, useState, useEffect } from "react";
import {
  sendChatMessageRequest,
  getChatHistoryRequest,
  confirmBookingRequest,
  confirmCancelRequest,
  confirmComplaintRequest,
} from "../api/chatApi.js";

export const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const loadHistory = async () => {
    if (historyLoaded) return;
    try {
      const res = await getChatHistoryRequest();
      setMessages(res.data.data);
      setHistoryLoaded(true);
    } catch (err) {
      setHistoryLoaded(true);
    }
  };

  const sendMessage = async (text) => {
    const userMessage = { sender: "user", message: text, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await sendChatMessageRequest(text);
      const aiMessage = {
        sender: "ai",
        message: res.data.data.reply,
        intent: res.data.data.intent,
        action: res.data.data.action,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      return aiMessage;
    } catch (err) {
      const errorMessage = {
        sender: "ai",
        message: "Something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return errorMessage;
    } finally {
      setLoading(false);
    }
  };

  const confirmAction = async (action) => {
    setLoading(true);
    try {
      let resultMessage;
      if (action.type === "confirm_booking") {
        const res = await confirmBookingRequest({
          roomId: action.roomId,
          checkIn: action.checkIn,
          checkOut: action.checkOut,
          guests: action.guests,
        });
        resultMessage = `Booking confirmed! Your ${res.data.data.roomTitle} is booked from ${res.data.data.checkIn} to ${res.data.data.checkOut}. Total: \u20B9${res.data.data.totalAmount}.`;
      } else if (action.type === "confirm_cancel") {
        await confirmCancelRequest(action.bookingId);
        resultMessage = "Your booking has been cancelled.";
      } else if (action.type === "confirm_complaint") {
        const res = await confirmComplaintRequest({
          subject: action.subject,
          description: action.description,
          category: action.category,
        });
        resultMessage = `Your complaint has been registered. Complaint ID: ${res.data.data.id}.`;
      } else {
        resultMessage = "Something went wrong. Please try again.";
      }

      setMessages((prev) => [
        ...prev,
        { sender: "ai", message: resultMessage, createdAt: new Date().toISOString() },
      ]);
    } catch (err) {
      const errorText = err.response?.data?.message || "Something went wrong completing that. Please try again.";
      setMessages((prev) => [
        ...prev,
        { sender: "ai", message: errorText, createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <ChatContext.Provider value={{ messages, loading, sendMessage, confirmAction, clearChat, loadHistory }}>
      {children}
    </ChatContext.Provider>
  );
};