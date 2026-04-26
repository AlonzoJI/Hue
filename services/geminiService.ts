
import { GoogleGenAI, Type } from "@google/genai";
import { AIFeedback, ProficiencyLevel } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result as string;
            resolve(base64data.substr(base64data.indexOf(',') + 1));
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
};

const challengeWordsSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.STRING
    }
};

export const getChallengeWords = async (prompt: string, targetLanguage: string, proficiency: ProficiencyLevel): Promise<string[]> => {
    try {
        // Strictly enforce proficiency level appropriateness
        const systemInstruction = `You are an expert language curriculum designer. Generate exactly 4 challenging but appropriate vocabulary words or short idioms IN ${targetLanguage} for a user learning ${targetLanguage} at a **${proficiency}** level.

Rules:
1. The words MUST be written in ${targetLanguage}, not in English.
2. **Beginner**: Use ONLY high-frequency, daily survival words (A1/A2). NO abstract concepts or rare idioms.
3. **Intermediate**: Use conversational connectors, B1/B2 nouns/verbs.
4. **Expert**: Use C1/C2 nuanced vocabulary, formal terms, or native idioms.
5. The words must be relevant to the topic: "${prompt}".
6. Return ONLY a JSON array of strings.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate words for: "${prompt}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: challengeWordsSchema,
            }
        });

        const jsonText = response.text.trim();
        if (!jsonText) {
             throw new Error("API returned empty response for challenge words.");
        }
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error getting challenge words:", error);
        // Return a safe fallback if API fails
        return ["hello", "thank you", "goodbye", "please"];
    }
};

const feedbackItemSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: "Strict score from 1 to 100." },
        feedback: { type: Type.STRING, description: "1-2 short, constructive bullet points." }
    },
    required: ["score", "feedback"]
};

const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        transcription: {
            type: Type.STRING,
            description: "The verbatim transcription."
        },
        feedback: {
            type: Type.OBJECT,
            properties: {
                grammar: { ...feedbackItemSchema, description: "Evaluation of syntax, verb conjugation, and sentence logic." },
                pronunciation: feedbackItemSchema,
                fluency: feedbackItemSchema,
                vocabulary: feedbackItemSchema,
                clarity: { ...feedbackItemSchema, description: "Evaluation of how clear the speech was AND IF IT DIRECTLY ANSWERED THE PROMPT." },
                overallScore: {
                    type: Type.NUMBER,
                    description: "The mathematical average of the 5 sub-scores."
                },
                challengeWordsUsed: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            word: { type: Type.STRING },
                            used: { type: Type.BOOLEAN },
                            feedback: { type: Type.STRING }
                        },
                        required: ["word", "used", "feedback"]
                    }
                }
            },
            required: ["grammar", "pronunciation", "fluency", "vocabulary", "clarity", "overallScore", "challengeWordsUsed"]
        }
    },
    required: ["transcription", "feedback"]
};

export const evaluateSpeech = async (
    audioBlob: Blob,
    targetLanguage: string,
    proficiency: ProficiencyLevel,
    dailyPrompt: string,
    challengeWords: string[],
    userName: string
): Promise<{ transcription: string; feedback: AIFeedback }> => {
    try {
        const audioData = await blobToBase64(audioBlob);
        const audioPart = {
            inlineData: {
                mimeType: 'audio/webm',
                data: audioData,
            },
        };

        const systemInstruction = `You are 'Hue', a strict but helpful language examiner. You are evaluating ${userName}, a ${proficiency} level learner of ${targetLanguage}.

**SCORING RUBRIC (STRICT):**

1. **PROMPT ALIGNMENT (CRITICAL):**
   - The user MUST answer the prompt: "${dailyPrompt}".
   - If the user speaks about something else, the **Clarity** score must be **< 40** and **Overall Score** must be **< 50**. No exceptions.

2. **GRAMMAR & LOGIC:**
   - Analyze sentence structure rigorously. 
   - If sentences do not make logical sense (word salad), **Grammar** score is < 30.
   - **Score Guide:**
     - 90-100: Perfect native-like usage.
     - 70-89: Understandable but with errors.
     - < 60: Major errors that impede understanding.

3. **Overall Score:** Must be the exact average of the 5 sub-categories.

4. **Challenge Words:** Check if ${userName} used: [${challengeWords.join(', ')}].

5. **Feedback Style:** Be direct. Address ${userName} by name occasionally in the feedback text if it feels natural.`;

        const textPart = {
            text: `Evaluate this audio response to the prompt: "${dailyPrompt}".`
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [audioPart, textPart] },
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: feedbackSchema
            }
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);

        if (!parsedResponse.transcription || !parsedResponse.feedback) {
             throw new Error("AI response is missing required fields.");
        }
        
        return {
            transcription: parsedResponse.transcription,
            feedback: parsedResponse.feedback
        };
    } catch (error) {
        console.error("Error evaluating speech:", error);
        throw new Error("Failed to process audio. Please try again.");
    }
};
