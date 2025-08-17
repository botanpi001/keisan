
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY環境変数が設定されていません。AI機能は無効になります。");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getFunFact = async (): Promise<string> => {
  if (!API_KEY) {
    return "すごい！その調子でがんばろう！";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "簡単な足し算の問題に正解した子供向けの、とても短くて励みになる、数字や数学、学習に関する豆知識を日本語で一つ生成してください。ポジティブな内容でお願いします。",
      config: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching fun fact from Gemini API:", error);
    // Return a graceful fallback message
    return "とってもよくできました！";
  }
};
