import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MODEL = "gemini-embedding-001";

export default async function getEmbedding(
  text: string
): Promise<number[] | null> {
  try {
    const response = await ai.models.embedContent({
      model: MODEL,
      contents: text,
    });

    const values = response.embeddings?.[0]?.values;
    if (!values) return null;

    // HARD CONVERSION — works for Float32Array or array
    const arr = Array.from(values as any) as number[];

    console.log("Returned type:", Object.prototype.toString.call(arr));
    console.log("Is Array:", Array.isArray(arr));
    console.log("First 3:", arr.slice(0, 3));

    return arr;

  } catch (err: any) {
    console.error("Gemini embedding error:", err.message);
    return null;
  }
}


