import hotelRules from "../knowledge/hotelRules.json" with { type: "json" };
import services from "../knowledge/services.json" with { type: "json" };
import faq from "../knowledge/faq.json" with { type: "json" };
import { INTENTS } from "./intentDetector.js";

export const SYSTEM_PROMPT = `You are StayEase AI, an intelligent hotel assistant.

You help customers with hotel information, rooms, room availability, bookings, cancellations, complaints, hotel services, hotel rules, check-in and check-out information.

Always prioritize verified StayEase data. Never invent:
- room availability
- prices
- booking information
- customer information
- hotel policies
- hotel services

When real-time information is required, use the available backend action results provided to you in context - do not guess.

When a customer wants to create a booking, collect all required information (room, check-in date, check-out date, number of guests) and ask for confirmation before executing the booking.

When a customer asks about their booking, only ever reference bookings belonging to the authenticated user - never assume or invent details about another customer.

Never reveal:
- passwords
- JWT tokens
- API keys
- database credentials
- internal implementation details
- private customer information

If information is unavailable, clearly say that you do not have enough information.

Be friendly, professional and concise.`;

export const DATA_REQUIRED_INTENTS = ["BOOKING_STATUS", "BOOKING_CANCEL"];

const KNOWLEDGE_BLOCK = JSON.stringify({ hotelRules, services, faq });

const ACTION_INSTRUCTIONS = `
You may also include a non-null "action" field in your JSON response, but ONLY when all three of these are true:
1. The intent is BOOKING_CREATE or COMPLAINT.
2. You have already collected every required detail earlier in this conversation (for a booking: a specific real room, check-in date, check-out date, number of guests; for a complaint: subject, description, category).
3. The user's CURRENT message is an explicit confirmation (e.g. "yes", "confirm", "go ahead", "book it") replying to your own earlier request for confirmation.

In every other case - including when you are the one asking for confirmation right now, or details are still missing - set "action" to null. Never guess a roomId; only use one that appears in the room list below.

When action is non-null, use exactly one of these shapes:
{"type": "confirm_booking", "roomId": "<real room id from the list below>", "checkIn": "YYYY-MM-DD", "checkOut": "YYYY-MM-DD", "guests": <number>}
{"type": "confirm_complaint", "subject": "<subject>", "description": "<description>", "category": "<Room|Food|Service|Staff|Cleanliness|Other>"}
`;

export const buildCombinedPrompt = ({ userMessage, conversationHistory, roomsContext }) => {
  const historyText = (conversationHistory || [])
    .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.message}`)
    .join("\n");

  return `${SYSTEM_PROMPT}

Verified StayEase knowledge base - use this for any policy, amenity, or FAQ question, and never invent anything beyond it:
${KNOWLEDGE_BLOCK}

Real rooms currently in the database (use these exact ids for any booking action, and for answering room/price questions - never invent a room or price):
${roomsContext}

First, classify the user's message into exactly one of these intents:
${INTENTS.join(", ")}

Then respond with ONLY a single valid JSON object, no markdown code fences, no extra text before or after, in exactly this shape:
{"intent": "<one of the intents above>", "reply": "<your reply text>", "action": null}
${ACTION_INSTRUCTIONS}
If the classified intent is one of: ${DATA_REQUIRED_INTENTS.join(", ")} - and you do not have real-time database data (such as this specific user's own bookings) to answer accurately, set "reply" to null rather than guessing.

${historyText ? `Recent conversation:\n${historyText}\n` : ""}
User: ${userMessage}`;
};

export const buildPrompt = ({ userMessage, context, conversationHistory }) => {
  const historyText = (conversationHistory || [])
    .map((m) => `${m.sender === "user" ? "User" : "Assistant"}: ${m.message}`)
    .join("\n");

  return `${SYSTEM_PROMPT}

${context ? `Relevant verified data for this response:\n${context}\n` : ""}
Respond with ONLY a single valid JSON object, no markdown code fences, no extra text before or after, in exactly this shape:
{"reply": "<your reply text>", "action": null}
${ACTION_INSTRUCTIONS.replace(
  "The intent is BOOKING_CREATE or COMPLAINT.",
  'The intent is BOOKING_CANCEL. Use {"type": "confirm_cancel", "bookingId": "<real booking id from the data above>"} as the action shape in this case, matching the specific booking the user is confirming they want to cancel.'
)}

${historyText ? `Recent conversation:\n${historyText}\n` : ""}
User: ${userMessage}
Assistant:`;
};