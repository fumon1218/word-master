import { GoogleGenAI, Type } from "@google/genai";
import { FALLBACK_SENTENCES } from "../constants";

export const generateSentences = async (): Promise<string[]> => {
  if (!process.env.API_KEY) {
    console.warn("No API_KEY found. Using fallback sentences.");
    return FALLBACK_SENTENCES;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "어린이(7세~9세)를 위한 받아쓰기 연습용 한글 문장 5개를 만들어주세요. 받침이 너무 복잡하지 않은 쉬운 문장이어야 합니다.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentences: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      if (data.sentences && Array.isArray(data.sentences)) {
        return data.sentences;
      }
    }
    return FALLBACK_SENTENCES;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return FALLBACK_SENTENCES;
  }
};

export const generateWords = async (): Promise<string[]> => {
   if (!process.env.API_KEY) {
    return ["바나나", "기차", "피아노", "어머니", "강아지"];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "받침이 없거나 간단한 한글 단어 10개를 생성해주세요. 2~3음절로 구성된 아이들이 알만한 단어.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            words: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      if (data.words && Array.isArray(data.words)) {
        return data.words;
      }
    }
    return ["바나나", "기차", "피아노", "어머니", "강아지"];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return ["바나나", "기차", "피아노", "어머니", "강아지"];
  }
}
