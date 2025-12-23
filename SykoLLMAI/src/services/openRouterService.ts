import { GeminiResponse, Message, CharacterConfig, AIModel } from "../types";

export const sendToOpenRouter = async (
  apiKey: string,
  modelId: string,
  prompt: string,
  history: Message[],
  mode: 'ASSISTANT' | 'ROLEPLAY',
  characterConfig?: CharacterConfig
): Promise<GeminiResponse> => {
  if (!apiKey) {
    throw new Error("OpenRouter API Key is missing. Please add it in settings.");
  }

  // Prepare System Prompt
  let systemContent = "You are a helpful AI assistant.";
  if (mode === 'ASSISTANT') {
    systemContent = "You are a helpful, knowledgeable, and friendly AI assistant. Be concise and clear.";
  } else if (mode === 'ROLEPLAY' && characterConfig) {
    systemContent = `
    You are roleplaying as: ${characterConfig.name}.
    
    Character Definition:
    ${characterConfig.bio}
    
    Guidelines:
    - Stay in character at all times.
    - Do not break the fourth wall unless the character would.
    - Match the tone and style defined in the bio.
    - Do not mention you are an AI unless it is part of the character.
    - Engage naturally with the user.
    `;
  }

  // Format Messages for OpenAI/OpenRouter Standard
  const messagesPayload = [
    { role: "system", content: systemContent },
    ...history.slice(-15).map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.text
    })),
    { role: "user", content: prompt }
  ];

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin, // Required by OpenRouter
        "X-Title": "SykoLLM.Ai Wood Theme", // Optional
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: modelId,
        messages: messagesPayload,
        temperature: mode === 'ROLEPLAY' ? 0.8 : 0.7,
      })
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "OpenRouter API Error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "...";

    // OpenRouter doesn't typically return Google grounding metadata in the same format,
    // so we return just text.
    return {
      text: content,
      groundingMetadata: undefined 
    };

  } catch (error) {
    console.error("OpenRouter Service Error:", error);
    throw error;
  }
};