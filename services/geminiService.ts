
import { GoogleGenAI, Type } from "@google/genai";
import { SQLAnalysis } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    isBuggy: {
      type: Type.BOOLEAN,
      description: 'A boolean indicating if a bug was found in the SQL query.',
    },
    bugDescription: {
      type: Type.STRING,
      description: 'A concise explanation of the bug. If no bug, explain why the query is correct according to the schema.',
    },
    suggestedFix: {
      type: Type.STRING,
      description: 'The corrected SQL query. If no bug was found, this should be the original query.',
    },
  },
  required: ['isBuggy', 'bugDescription', 'suggestedFix'],
};

export const analyzeSql = async (schema: string, query: string): Promise<SQLAnalysis> => {
  const prompt = `
    Based on the database schema provided below, please analyze the SQL query for any bugs, typos, or logical errors.
    
    Database Schema:
    ---
    ${schema}
    ---
    
    SQL Query to Analyze:
    ---
    ${query}
    ---

    Analyze the query and respond ONLY with a JSON object that conforms to the specified schema.
    - If there is a typo in a column name (e.g., 'FirsName' instead of 'FirstName'), identify it as a bug.
    - If a column is selected that does not exist in the specified tables, it's a bug.
    - If a table is queried that is not in the schema, it's a bug.
    - If the query is syntactically correct but logically flawed according to the schema (e.g., wrong join conditions that don't make sense), consider it a bug.
    - If the query is valid, report 'isBuggy' as false and provide a brief confirmation in 'bugDescription'.
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
            temperature: 0.2,
        },
    });

    const jsonText = response.text.trim();
    const parsedJson = JSON.parse(jsonText);
    
    // Type guard to be safe
    if (
        typeof parsedJson.isBuggy === 'boolean' &&
        typeof parsedJson.bugDescription === 'string' &&
        typeof parsedJson.suggestedFix === 'string'
    ) {
        return parsedJson as SQLAnalysis;
    } else {
        throw new Error("Received malformed JSON object from API.");
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from the AI service.");
  }
};
