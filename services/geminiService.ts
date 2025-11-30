import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { INITIAL_PROMPT } from '../constants';
import { AnalysisResult } from '../types';

let genAI: GoogleGenAI | null = null;

export const initGemini = () => {
  const apiKey = process.env.API_KEY;
  if (apiKey) {
    genAI = new GoogleGenAI({ apiKey });
  }
};

export const analyzeBusiness = async (bizDesc: string): Promise<AnalysisResult> => {
  if (!genAI) {
    initGemini();
    if (!genAI) {
      throw new Error("Gemini API Key is missing. Please set REACT_APP_GEMINI_API_KEY.");
    }
  }

  const model = genAI.models;
  
  // Using Flash for speed as per instructions for basic text tasks
  const result = await model.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${INITIAL_PROMPT}\n${bizDesc}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          risks: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  if (result.text) {
    return JSON.parse(result.text) as AnalysisResult;
  }
  
  throw new Error("Failed to generate analysis");
};