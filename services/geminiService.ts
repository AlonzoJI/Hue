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
        const systemInstruction = `You are an AI language tutor. Based on the prompt and proficiency level for a ${targetLanguage} learner, generate a JSON array of 3-5 challenging but relevant vocabulary words the user should try to use. Adjust difficulty for the proficiency level. Return only the JSON array.
- Beginner: Common, useful words.
- Intermediate: More nuanced or less common words.
- Expert: Idiomatic expressions or highly specific vocabulary.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Prompt: "${prompt}", Proficiency: ${proficiency}`,
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
        throw new Error("Failed to generate challenge words.");
    }
};

const feedbackItemSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.NUMBER, description: "Strict score from 1 to 100. Be critical." },
        feedback: { type: Type.STRING, description: "1-2 short, constructive bullet points with examples. State clearly if the error was major." }
    },
    required: ["score", "feedback"]
};

const feedbackSchema = {
    type: Type.OBJECT,
    properties: {
        transcription: {
            type: Type.STRING,
            description: "The verbatim transcription of the user's audio response."
        },
        feedback: {
            type: Type.OBJECT,
            description: "Detailed feedback on the user's speech.",
            properties: {
                grammar: { ...feedbackItemSchema, description: "Rigorous evaluation of syntax, verb conjugation, and sentence structure logic." },
                pronunciation: feedbackItemSchema,
                fluency: feedbackItemSchema,
                vocabulary: { ...feedbackItemSchema, description: "Evaluation of word choice, range, and idiomatic language use." },
                clarity: { ...feedbackItemSchema, description: "Evaluation of how clear the speech was AND IF IT DIRECTLY ANSWERED THE PROMPT." },
                overallScore: {
                    type: Type.NUMBER,
                    description: "A single, strict overall score from 1 to 100, averaging the other five scores."
                },
                challengeWordsUsed: {
                    type: Type.ARRAY,
                    description: "Evaluation of whether the user included the challenge words correctly and naturally.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            word: { type: Type.STRING },
                            used: { type: Type.BOOLEAN },
                            feedback: { type: Type.STRING, description: "A short, specific comment on how the word was used (e.g., 'Used perfectly in context.', 'Slightly unnatural phrasing, but understandable.')."}
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
    challengeWords: string[]
): Promise<{ transcription: string; feedback: AIFeedback }> => {
    try {
        const audioData = await blobToBase64(audioBlob);
        const audioPart = {
            inlineData: {
                mimeType: 'audio/webm',
                data: audioData,
            },
        };

        // Stricter System Instruction
        const systemInstruction = `You are a strict, world-class linguistics examiner for a user learning ${targetLanguage} at a ${proficiency} level. Your name is 'Lingo'.
Your task is to analyze the user's spoken response and provide a JSON object that strictly adheres to the provided schema.

**STRICT SCORING GUIDELINES - DO NOT INFLATE SCORES:**

1. **PROMPT RELEVANCE (CRITICAL):** The user MUST answer the specific prompt: "${dailyPrompt}". 
   - If the response is off-topic, vague, or ignores the prompt completely, the **Clarity** and **Overall Score** must be **below 50**. 
   - State explicitly in the 'Clarity' feedback if they went off-topic.

2. **GRAMMAR & LOGIC:** 
   - Analyze if the sentences make logical sense. If the user is speaking "word salad" (incoherent words strung together), the Grammar score must be **below 40**.
   - Penalize incorrect verb tenses, gender agreement, and awkward phrasing heavily.
   - **Score Guide:**
     - 90-100: Native speaker level. Flawless logic and grammar.
     - 75-89: Very good, minor errors that don't impede meaning.
     - 60-74: Understandable, but frequent errors or unnatural phrasing.
     - 40-59: Hard to follow, broken sentences, or off-topic.
     - < 40: Unintelligible or completely irrelevant.

3. **Proficiency Context:**
   - For '${proficiency}': Evaluate based on expected capabilities, but do not forgive basic mistakes that violate the laws of the language.

4. **Challenge Words:** Analyze the use of these words: [${challengeWords.join(', ')}]. 

Output strictly in JSON.`;

        const textPart = {
            text: `The user is a ${proficiency} learner responding to the prompt: "${dailyPrompt}". Evaluate this strictly.`
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
        if (!jsonText) {
             throw new Error("AI service returned an empty response.");
        }
        const parsedResponse = JSON.parse(jsonText);

        if (!parsedResponse.transcription || !parsedResponse.feedback) {
             throw new Error("AI response is missing required transcription or feedback fields.");
        }
        
        return {
            transcription: parsedResponse.transcription,
            feedback: parsedResponse.feedback
        };
    } catch (error) {
        console.error("Error evaluating speech with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to process audio with AI service: ${error.message}`);
        }
        throw new Error("Failed to process audio with AI service due to an unknown error.");
    }
};