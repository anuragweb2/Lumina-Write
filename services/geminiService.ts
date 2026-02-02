import { GoogleGenAI } from "@google/genai";
import { Tone } from "../types";
import { config } from "../config";
import { logger } from "../utils/logger";

// Initialize the client using the centralized config
// This ensures we always use the environment-specific key
const ai = new GoogleGenAI({ apiKey: config.apiKey });

/**
 * Corrects the grammar and phrasing of the provided text with a specific tone.
 */
export const correctText = async (text: string, tone: Tone = 'Professional'): Promise<string> => {
  if (!text.trim()) return "";

  logger.debug(`Processing text with tone: ${tone}`, { length: text.length });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: text,
      config: {
        systemInstruction: `You are an expert professional editor and proofreader. 
        Your task is to analyze the user's input text and correct all grammar, spelling, punctuation, and phrasing errors, while adapting the tone to be "${tone}".
        
        Strict Guidelines:
        1. Correct all grammar and spelling errors.
        2. Adapt the tone to: ${tone}.
           - Professional: Formal, objective, clear.
           - Casual: Relaxed, conversational, friendly but correct.
           - Concise: Brief, direct, remove formatting/fluff.
           - Friendly: Warm, approachable, empathetic.
        3. Preserve the original meaning and intent completely.
        4. Do NOT add conversational filler (e.g., "Here is the corrected text").
        5. Return ONLY the corrected text string.`,
        temperature: 0.3,
      },
    });

    const corrected = response.text;
    
    if (!corrected) {
      throw new Error("No correction generated.");
    }

    logger.debug("Correction successful");
    return corrected.trim();
  } catch (error) {
    logger.error("Gemini API Error:", error);
    throw error;
  }
};