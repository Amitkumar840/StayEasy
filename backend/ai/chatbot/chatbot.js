import { generateWithRetry } from "../config/geminiConfig.js";
import { buildPrompt, buildCombinedPrompt, DATA_REQUIRED_INTENTS } from "./prompt.js";
import { INTENTS } from "./intentDetector.js";
import { searchRooms } from "../actions/roomSearchAction.js";
import {
  createBookingViaAI,
  getUserBookingsViaAI,
  cancelBookingViaAI,
} from "../actions/bookingAction.js";
import { createComplaintViaAI } from "../actions/complaintAction.js";

/**
 * Pulls ISO-format dates (YYYY-MM-DD) out of free text, so that
 * when a user gives explicit dates, room search can check real
 * availability for those dates rather than just listing rooms with
 * the isAvailable flag on. Deliberately simple - a real system
 * might use function calling, but this keeps the logic auditable
 * and avoids spending an extra Gemini call just to parse dates.
 */
const extractIsoDates = (text) => {
  const matches = text.match(/\d{4}-\d{2}-\d{2}/g) || [];
  return { checkIn: matches[0] || null, checkOut: matches[1] || null };
};

const parseJsonResponse = (rawText) => {
  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch (parseError) {
    return null;
  }
};

export const getChatbotResponse = async ({ userId, message, conversationHistory }) => {
  // If the user gave explicit dates, check real availability for
  // those dates; otherwise fall back to the general room list. This
  // is folded into the single combined call below rather than
  // triggering a second Gemini call.
  const { checkIn, checkOut } = extractIsoDates(message);
  const rooms = await searchRooms(checkIn && checkOut ? { checkIn, checkOut } : {});
  const roomsContext = checkIn && checkOut
    ? `Rooms genuinely available for ${checkIn} to ${checkOut} (checked against real bookings, not just a static flag): ${JSON.stringify(rooms)}`
    : `All rooms currently marked available in general (not checked against any specific dates yet - ask the user for dates if they want a specific-date availability check): ${JSON.stringify(rooms)}`;

  const combinedPrompt = buildCombinedPrompt({ userMessage: message, conversationHistory, roomsContext });
  const combinedResult = await generateWithRetry(combinedPrompt);
  const parsed = parseJsonResponse(combinedResult.response.text());

  const intent = parsed && INTENTS.includes(parsed.intent) ? parsed.intent : "UNKNOWN";
  const initialReply = parsed?.reply || null;
  const initialAction = parsed?.action || null;

  if (!DATA_REQUIRED_INTENTS.includes(intent) && initialReply) {
    return { reply: initialReply, intent, action: initialAction };
  }

  let context = null;
  try {
    if (intent === "BOOKING_STATUS" || intent === "BOOKING_CANCEL") {
      const bookings = await getUserBookingsViaAI(userId);
      context = `This user's actual bookings (use the real "id" field for any cancel action): ${JSON.stringify(bookings)}`;
    }
  } catch (actionError) {
    context = `An error occurred while fetching real data: ${actionError.message}. Tell the user you were unable to retrieve this information right now.`;
  }

  if (!context) {
    return {
      reply: initialReply || "I'm not sure how to help with that right now. Could you rephrase?",
      intent,
      action: null,
    };
  }

  const prompt = buildPrompt({ userMessage: message, context, conversationHistory });
  const result = await generateWithRetry(prompt);
  const secondParsed = parseJsonResponse(result.response.text());

  const reply = secondParsed?.reply || result.response.text().trim();
  const action = secondParsed?.action || null;

  return { reply, intent, action };
};

export const executeBookingCreation = async ({ userId, roomId, checkIn, checkOut, guests }) => {
  return createBookingViaAI({ userId, roomId, checkIn, checkOut, guests });
};

export const executeBookingCancellation = async ({ userId, bookingId }) => {
  return cancelBookingViaAI({ userId, bookingId });
};

export const executeComplaintCreation = async ({ userId, subject, description, category }) => {
  return createComplaintViaAI({ userId, subject, description, category });
};