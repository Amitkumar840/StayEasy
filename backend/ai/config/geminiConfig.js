import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// gemini-3.6-flash: fast and inexpensive, a good fit for a chat
// assistant that needs to respond quickly and often.
export const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

/**
 * Wraps model.generateContent() with a couple of retries on 503
 * (model temporarily overloaded), since this happens often enough
 * in practice that surfacing it straight to the user would be a
 * poor experience for something that usually clears up in seconds.
 */
export const generateWithRetry = async (prompt, maxRetries = 2) => {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      lastError = error;
      const isOverloaded = error.message?.includes("503") || error.message?.includes("overloaded");
      if (!isOverloaded || attempt === maxRetries) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
    }
  }
  throw lastError;
};

export default genAI;
