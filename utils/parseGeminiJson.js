export function parseGeminiJson(rawText) {
  if (!rawText?.trim()) {
    throw new Error("Empty response from Gemini");
  }

  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");

  try {
    return JSON.parse(cleaned);
  } catch {
    const jsonMatch = cleaned.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    }
    throw new Error("Could not parse JSON from Gemini response");
  }
}
