import { generateWithRetry } from "../config/geminiConfig.js";

export const INTENTS = [
  "GREETING",
  "ROOM_SEARCH",
  "ROOM_DETAILS",
  "ROOM_AVAILABILITY",
  "PRICE_QUERY",
  "BOOKING_HELP",
  "BOOKING_CREATE",
  "BOOKING_STATUS",
  "BOOKING_CANCEL",
  "HOTEL_INFORMATION",
  "HOTEL_AMENITIES",
  "HOTEL_RULES",
  "CHECK_IN",
  "CHECK_OUT",
  "COMPLAINT",
  "SERVICES",
  "UNKNOWN",
];

const DETECTION_PROMPT = `You are an intent classifier for a hotel chatbot called StayEase AI.
Classify the user's message into exactly ONE of these intents:
${INTENTS.join(", ")}

Rules:
- GREETING: hello, hi, how are you, etc.
- ROOM_SEARCH: looking for rooms, wants to see options ("show me deluxe rooms", "rooms for 4 people")
- ROOM_DETAILS: asking about a specific room's features
- ROOM_AVAILABILITY: asking if a room is free for specific dates
- PRICE_QUERY: asking about cost/price of a room
- BOOKING_HELP: wants to book but hasn't given details yet ("I want to book a room")
- BOOKING_CREATE: has given enough details to actually create a booking (room, dates, guests) and is confirming
- BOOKING_STATUS: asking about an existing booking's status
- BOOKING_CANCEL: wants to cancel a booking
- HOTEL_INFORMATION: general questions about the hotel itself
- HOTEL_AMENITIES: asking about wifi, parking, pool, gym, etc.
- HOTEL_RULES: asking about policies (pets, smoking, ID, cancellation policy)
- CHECK_IN: asking about check-in time/process
- CHECK_OUT: asking about check-out time/process
- COMPLAINT: reporting a problem or issue
- SERVICES: asking about room service, laundry, etc.
- UNKNOWN: anything that doesn't clearly fit the above

Respond with ONLY the intent name, nothing else.

User message: "{{MESSAGE}}"`;

/**
 * Uses Gemini to classify a user message into one of the defined
 * intents. Falls back to UNKNOWN if the model returns something
 * unexpected or the call fails, rather than throwing - a chatbot
 * should degrade gracefully, not crash the whole request.
 */
export const detectIntent = async (message) => {
  try {
    const prompt = DETECTION_PROMPT.replace("{{MESSAGE}}", message);
    const result = await generateWithRetry(prompt);
    const text = result.response.text().trim();

    const matched = INTENTS.find((intent) => text.includes(intent));
    return matched || "UNKNOWN";
  } catch (error) {
    console.error("Intent detection failed:", error.message);
    return "UNKNOWN";
  }
};
