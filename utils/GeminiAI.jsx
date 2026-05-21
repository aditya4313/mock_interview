const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEYS;

// Tried in order: 2.5-flash often returns 503; flash-latest is stable on free tier.
const MODEL_FALLBACK_CHAIN = [
  "gemini-flash-latest",
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
];

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
};

function isRetryableGeminiError(error) {
  const message = String(error?.message || "");
  return (
    message.includes("503") ||
    message.includes("429") ||
    message.includes("404") ||
    message.includes("high demand") ||
    message.includes("not found") ||
    message.includes("quota")
  );
}

export async function generateGeminiContent(prompt, { json = false } = {}) {
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Set NEXT_PUBLIC_GEMINI_API_KEYS in .env.local");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError;

  for (const modelName of MODEL_FALLBACK_CHAIN) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          ...generationConfig,
          responseMimeType: json ? "application/json" : "text/plain",
        },
      });

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;
      if (isRetryableGeminiError(error)) {
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error("All Gemini models failed. Please try again later.");
}

/** @deprecated Prefer generateGeminiContent — kept for RecordAnsSection compatibility */
export const chatSession = {
  async sendMessage(prompt) {
    const text = await generateGeminiContent(prompt, { json: true });
    return {
      response: {
        text: () => text,
      },
    };
  },
};
