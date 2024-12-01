import {
  GoogleGenerativeAI,
  GenerativeModel,
  GenerationConfig,
  ErrorDetails,
} from "@google/generative-ai";

export class GeminiAIService {
  apiKey: string | undefined;
  genAI: GoogleGenerativeAI;
  model: GenerativeModel;
  generationConfig: GenerationConfig;
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(this.apiKey || "");
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    this.generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    };
  }

  // Method to generate response from the AI model
  async generateResponse(inputText: string) {
    if (!inputText) {
      throw new Error("Input text is required");
    }

    try {
      const chatSession = this.model.startChat({
        generationConfig: this.generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(inputText);
      return result.response.text(); // Return the generated response text
    } catch (error) {
      console.error(error);
    }
  }
}
