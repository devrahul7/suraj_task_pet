export interface AIMatchResult {
  petId: string;
  matchScore: number;
  reasons: string[];
  concerns: string[];
}

export interface PetRecommendation {
    petId: string;

    name: string;

    species: string;

    breed: string;

    age: number;

    image?: string;

    matchScore: number;

    recommendation: string;

    reasons: string[];

    concerns: string[];
}

export interface ChatSession {
    sessionId: string;
    lastMessage: string;
    updatedAt: Date;
}
export interface AIChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}
export interface ChatRequest {
    sessionId: string;
    message: string;
}
export interface ChatResponse {
    sessionId: string;
    response: string;
}
