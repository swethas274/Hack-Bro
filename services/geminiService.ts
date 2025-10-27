import { GoogleGenAI, Chat, Part } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

// Ensure the API key is available
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chat: Chat = ai.chats.create({
  model: 'gemini-2.5-flash', // This model supports multimodal input
  config: {
    systemInstruction: SYSTEM_INSTRUCTION,
  },
});

interface SendMessageOptions {
    message: string;
    imagePart?: Part;
    tone: string;
    wordLimit: string;
}

export const sendMessageToGemini = async ({ message, imagePart, tone, wordLimit }: SendMessageOptions) => {
  try {
    // Prepend user preferences to the text message
    const userPreferences = `(User preferences: Tone=${tone}, Word Limit=${wordLimit})`;
    const fullMessage = `${userPreferences}\n\n${message}`;

    const parts: Part[] = [{ text: fullMessage }];
    if (imagePart) {
        parts.unshift(imagePart); // Add image first
    }

    const result = await chat.sendMessageStream({ parts });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw new Error("Failed to get response from AI. Please check your API key and network connection.");
  }
};
