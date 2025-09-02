
import { GoogleGenAI, Type } from "@google/genai";
import type { Weightages, AnalysisReport } from "../types";
import { GEMINI_MODEL_NAME } from "../constants";

// Initialize the Google GenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Defines the JSON schema for the expected response from the Gemini API.
 * This ensures the AI returns data in a structured and predictable format.
 */
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        startupName: { type: Type.STRING, description: "Inferred name of the startup from the documents." },
        summary: { type: Type.STRING, description: "A 2-3 sentence executive summary of the investment opportunity." },
        keyStrengths: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of 3-5 key strengths."
        },
        riskAssessment: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3-5 key risks and red flags (e.g., inconsistent metrics, inflated market size, high churn)."
        },
        benchmarkAnalysis: { type: Type.STRING, description: "Comparison of the startup to its sector peers on metrics like financials, hiring, and traction." },
        growthPotential: { type: Type.STRING, description: "Summary of the growth potential and market opportunity." },
        recommendation: { 
            type: Type.STRING, 
            description: "Final investment recommendation ('Strong Recommend', 'Recommend', 'Pass', 'Strong Pass'), influenced by user's weightages." 
        },
        overallScore: { type: Type.NUMBER, description: "A score from 0 to 100, calculated based on the analysis and provided weightages." }
    },
    required: ["startupName", "summary", "keyStrengths", "riskAssessment", "benchmarkAnalysis", "growthPotential", "recommendation", "overallScore"]
};

/**
 * Sends startup data and analysis parameters to the Gemini API to generate an investment memo.
 * @param files - An array of file objects, each containing the mimeType and base64-encoded data.
 * @param pastedText - Additional text context provided by the user.
 * @param weightages - The user-defined weights for the investment thesis.
 * @returns A promise that resolves to a structured AnalysisReport object.
 * @throws Will throw an error if the API call fails or if the response is not valid JSON.
 */
export const analyzeStartup = async (
    files: { mimeType: string; data: string }[],
    pastedText: string,
    weightages: Weightages
): Promise<AnalysisReport> => {
    
    // Convert file data into the format required by the Gemini API (inlineData parts).
    const fileParts = files.map(file => ({
        inlineData: {
            mimeType: file.mimeType,
            data: file.data,
        },
    }));

    const textParts = [];
    if (pastedText.trim()) {
        textParts.push({ text: `Additional context from text input:\n${pastedText}` });
    }

    /**
     * The system instruction provides high-level guidance to the AI model.
     * It sets the persona (VC analyst), the main goal, and crucially,
     * instructs the model to use the user-defined weightages in its analysis.
     */
    const systemInstruction = `You are an expert venture capital analyst for early-stage tech startups. Your task is to analyze the provided documents (pitch deck, transcripts, text inputs) and generate a concise, actionable investment memo.

You MUST use these user-defined weightages to influence your final recommendation and overall score:
- Team: ${weightages.team}%
- Product: ${weightages.product}%
- Market: ${weightages.market}%
- Traction: ${weightages.traction}%

Analyze the provided materials, leveraging your internal knowledge of market trends, competitive landscapes, and financial benchmarks. Your entire response must be a single JSON object conforming to the provided schema. Do not include any text, markdown, or explanations outside of the JSON structure.
`;

    const prompt = "Please generate the investment memo based on the provided documents and my investment thesis weights.";

    // Make the API call to the Gemini model.
    const response = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: {
            // Combine file parts, the main prompt, and any additional text parts.
            parts: [...fileParts, { text: prompt }, ...textParts]
        },
        config: {
            systemInstruction,
            responseMimeType: "application/json", // We expect a JSON response.
            responseSchema, // We enforce the structure of the JSON response.
        },
    });

    const jsonText = response.text.trim();
    try {
        // Parse the JSON text from the response.
        const parsedJson = JSON.parse(jsonText);
        return parsedJson as AnalysisReport;
    } catch (e) {
        console.error("Failed to parse Gemini response as JSON:", jsonText);
        throw new Error("The analysis returned an invalid format. Please try again.");
    }
};
