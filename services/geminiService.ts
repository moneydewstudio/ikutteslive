import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question } from "../types";

// In a real app, this should be an env variable. 
// For this demo, we assume the environment is set up correctly as per instructions.
// If process.env.API_KEY is missing, this will throw.
const getClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please set REACT_APP_GEMINI_API_KEY or similar.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    subject: { type: Type.STRING, enum: ['TIU', 'TWK', 'TKP'] },
    difficulty: { type: Type.INTEGER, description: "1 to 5" },
    text: { type: Type.STRING },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING }
        },
        required: ['id', 'text']
      }
    },
    correct_option_id: { type: Type.STRING },
    explanation: { type: Type.STRING }
  },
  required: ['subject', 'difficulty', 'text', 'options', 'correct_option_id', 'explanation']
};

export const generateQuestionWithAI = async (subject: string): Promise<Partial<Question>> => {
  try {
    const ai = getClient();
    const prompt = `Generate a challenging multiple choice question for the Indonesian CPNS exam.
    Subject: ${subject} (TIU, TWK, or TKP).
    The options should be IDs 'a', 'b', 'c', 'd', 'e'.
    The language must be Indonesian.
    Ensure the explanation is concise (max 40 words).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      // Ensure ID is unique in client usage
      return {
        ...data,
        id: `ai_${Date.now()}`
      };
    }
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};