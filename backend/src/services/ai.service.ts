import OpenAI from "openai";
import { openai } from "../config/openai";
import { OPENAI_MODEL } from "../config/constant";
import { DESCRIPTION_PROMPT } from "../prompts/description.prompt";
import {
  GeneratePetDescriptionDto,
  PetRecommendationDto,
} from "../dtos/ai.dto";
import { HttpException } from "../exceptions/http-exception";
import { COMPATIBILITY_PROMPT } from "../prompts/compatibility.prompt";
import { UserRepository } from "../repositories/user.repository";
import { PetRepository } from "../repositories/pet.repository";
import { AIMatchResult } from "../types/ai.type";
import { ChatRepository } from "../repositories/chat.repository";
import { CHATBOT_PROMPT } from "../prompts/chatbot.prompt";
import { RECOMMENDATION_PROMPT } from "../prompts/recommendation.prompt";

export class AIService {
  constructor(
    private userRepository = new UserRepository(),
    private petRepository = new PetRepository(),
    private chatRepository = new ChatRepository()
  ) {}

  // ─── Pet Description Generation ───────────────────────────

  async generatePetDescription(
    pet: GeneratePetDescriptionDto
  ): Promise<string> {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: DESCRIPTION_PROMPT,
        },
        {
          role: "user",
          content: `Pet Information

Name: ${pet.name}
Species: ${pet.species}
Breed: ${pet.breed}
Age: ${pet.age}
Size: ${pet.size}
Gender: ${pet.gender}

Current Description:
${pet.description}

Temperament:
${pet.temperament.join(", ")}

Activity Level:
${pet.activityLevel}

Good With Kids:
${pet.goodWithKids ? "Yes" : "No"}

Good With Pets:
${pet.goodWithPets ? "Yes" : "No"}

Vaccinated:
${pet.vaccinated ? "Yes" : "No"}

Neutered:
${pet.neutered ? "Yes" : "No"}

Health Status:
${pet.healthStatus}`,
        },
      ],
      temperature: 0.8,
      max_completion_tokens: 250,
    });

    const description =
      response.choices[0]?.message?.content?.trim();

    if (!description) {
      throw new HttpException(
        500,
        "Failed to generate pet description."
      );
    }

    return description;
  }

  // ─── Compatibility Analysis ───────────────────────────────

  async analyzeCompatibility(
    userId: string,
    petId: string
  ): Promise<AIMatchResult> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found.");
    }

    const pet = await this.petRepository.findById(petId);

    if (!pet) {
      throw new HttpException(404, "Pet not found.");
    }

    const result = await this.generateJSON(
      COMPATIBILITY_PROMPT,
      `USER

Preferred Pet Types:
${user.preferences?.petType?.join(", ") || "Any"}

Preferred Size:
${user.preferences?.size?.join(", ") || "Any"}

Experience:
${user.preferences?.experience || "Unknown"}

Has Children:
${user.preferences?.hasChildren ? "Yes" : "No"}

Has Other Pets:
${user.preferences?.hasOtherPets ? "Yes" : "No"}

PET

Name: ${pet.name}
Species: ${pet.species}
Breed: ${pet.breed}
Age: ${pet.age}
Size: ${pet.size}
Temperament: ${pet.temperament.join(", ")}
Activity: ${pet.activityLevel}
Good With Kids: ${pet.goodWithKids ? "Yes" : "No"}
Good With Pets: ${pet.goodWithPets ? "Yes" : "No"}
Health: ${pet.healthStatus}`,
      0.3,
      300
    );

    return {
      petId: pet._id.toString(),
      matchScore: result.score,
      reasons: result.reasons ?? [],
      concerns: result.concerns ?? [],
    };
  }

  // ─── Match Pets for User ──────────────────────────────────

  async matchPetsForUser(
    userId: string
  ): Promise<AIMatchResult[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found.");
    }

    const { pets } = await this.petRepository.findAll(
      { status: "AVAILABLE" },
      1,
      100
    );

    if (!pets.length) return [];

    const matches = await Promise.all(
      pets.map((pet) =>
        this.analyzeCompatibility(userId, pet._id.toString())
      )
    );

    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }

  // ─── Personalized Recommendations ─────────────────────────

  async getPersonalizedRecommendations(
    userId: string
  ): Promise<PetRecommendationDto[]> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found.");
    }

    const { pets } = await this.petRepository.findAll(
      { status: "AVAILABLE" },
      1,
      100
    );

    const recommendations = await Promise.all(
      pets.map(async (pet) => {
        const result = await this.generateJSON(
          RECOMMENDATION_PROMPT,
          `USER

Pet Types:
${user.preferences?.petType?.join(", ") || "Any"}

Preferred Size:
${user.preferences?.size?.join(", ") || "Any"}

Experience:
${user.preferences?.experience || "Unknown"}

Children:
${user.preferences?.hasChildren ? "Yes" : "No"}

Other Pets:
${user.preferences?.hasOtherPets ? "Yes" : "No"}

PET

Name: ${pet.name}
Species: ${pet.species}
Breed: ${pet.breed}
Age: ${pet.age}
Size: ${pet.size}
Temperament: ${pet.temperament.join(", ")}
Activity: ${pet.activityLevel}
Health: ${pet.healthStatus}`,
          0.3,
          300
        );

        return {
          petId: pet._id.toString(),
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          age: pet.age,
          image: pet.images?.[0],
          matchScore: result.score,
          recommendation: result.recommendation,
          reasons: result.reasons ?? [],
          concerns: result.concerns ?? [],
        };
      })
    );

    return recommendations
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }

  // ─── Chat ─────────────────────────────────────────────────

  async getChatHistory(
    userId: string,
    sessionId: string,
    limit = 20
  ) {
    return this.chatRepository.getConversation(
      userId,
      sessionId,
      limit
    );
  }

  async getChatSessions(userId: string) {
    return this.chatRepository.getSessions(userId);
  }

  async deleteChatSession(
    userId: string,
    sessionId: string
  ) {
    await this.chatRepository.deleteSession(userId, sessionId);
  }

  async *chatStream(
    userId: string,
    sessionId: string,
    message: string
  ): AsyncGenerator<string> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new HttpException(404, "User not found.");
    }

    await this.chatRepository.saveMessage(
      userId,
      sessionId,
      "user",
      message
    );

    const history = await this.chatRepository.getConversation(
      userId,
      sessionId,
      20
    );

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: CHATBOT_PROMPT,
      },
      ...history.map((item) => ({
        role: item.role as "user" | "assistant" | "system",
        content: item.content,
      })),
    ];

    const stream = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      stream: true,
      temperature: 0.7,
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;

      if (!token) continue;

      fullResponse += token;
      yield token;
    }

    await this.chatRepository.saveMessage(
      userId,
      sessionId,
      "assistant",
      fullResponse
    );
  }

  // ─── Shared JSON helper ───────────────────────────────────

  private async generateJSON(
    systemPrompt: string,
    userPrompt: string,
    temperature = 0.3,
    maxTokens = 300
  ): Promise<any> {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_completion_tokens: maxTokens,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new HttpException(
        500,
        "OpenAI returned an empty response."
      );
    }

    return JSON.parse(content);
  }
}
