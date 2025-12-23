import { GoogleGenAI } from "@google/genai";
import { AppMode, GeminiResponse, Message, CharacterConfig } from "../types";

export const sendToGemini = async (
  prompt: string,
  history: Message[],
  mode: AppMode,
  characterConfig?: CharacterConfig
): Promise<GeminiResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Construct history for context (last 20 messages for better retention)
  const recentHistory = history.slice(-20).map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  let modelName = 'gemini-3-flash-preview';
  let tools: any[] = [];
  let systemInstruction = "You are a helpful AI assistant.";

  if (mode === 'ASSISTANT') {
    // General Assistant with Web Search
    modelName = 'gemini-3-flash-preview'; 
    systemInstruction = "You are a helpful, knowledgeable, and friendly AI assistant. Use the googleSearch tool to find up-to-date information when necessary. Be concise and clear.";
    tools = [{ googleSearch: {} }];

  } else if (mode === 'ROLEPLAY' && characterConfig) {
    // Roleplay Mode
    modelName = 'gemini-3-pro-preview'; // Pro model for better nuance
    systemInstruction = `
    You are roleplaying as: ${characterConfig.name}.
    
    Character Definition:
    ${characterConfig.bio}
    
    Guidelines:
    - Stay in character at all times.
    - Do not break the fourth wall unless the character would.
    - Match the tone and style defined in the bio.
    - Do not mention you are an AI or Gemini unless it is part of the character.
    - Engage naturally with the user.
    `;
    // No tools for pure roleplay typically, or add search if the character is a researcher
    tools = [];
  }

  try {
    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction,
        tools: tools.length > 0 ? tools : undefined,
      },
      history: recentHistory,
    });

    const result = await chat.sendMessage({ message: prompt });
    const responseText = result.text || "...";

    return {
      text: responseText,
      groundingMetadata: result.candidates?.[0]?.groundingMetadata as any, 
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};