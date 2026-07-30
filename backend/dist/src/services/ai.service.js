"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const openai_1 = require("../config/openai");
const constant_1 = require("../config/constant");
const description_prompt_1 = require("../prompts/description.prompt");
const http_exception_1 = require("../exceptions/http-exception");
const compatibility_prompt_1 = require("../prompts/compatibility.prompt");
const user_repository_1 = require("../repositories/user.repository");
const pet_repository_1 = require("../repositories/pet.repository");
const chat_repository_1 = require("../repositories/chat.repository");
const chatbot_prompt_1 = require("../prompts/chatbot.prompt");
const recommendation_prompt_1 = require("../prompts/recommendation.prompt");
class AIService {
    userRepository;
    petRepository;
    chatRepository;
    constructor(userRepository = new user_repository_1.UserRepository(), petRepository = new pet_repository_1.PetRepository(), chatRepository = new chat_repository_1.ChatRepository()) {
        this.userRepository = userRepository;
        this.petRepository = petRepository;
        this.chatRepository = chatRepository;
    }
    // ─── Pet Description Generation ───────────────────────────
    async generatePetDescription(pet) {
        const response = await openai_1.openai.chat.completions.create({
            model: constant_1.OPENAI_MODEL,
            messages: [
                {
                    role: "system",
                    content: description_prompt_1.DESCRIPTION_PROMPT,
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
        const description = response.choices[0]?.message?.content?.trim();
        if (!description) {
            throw new http_exception_1.HttpException(500, "Failed to generate pet description.");
        }
        return description;
    }
    // ─── Compatibility Analysis ───────────────────────────────
    async analyzeCompatibility(userId, petId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found.");
        }
        const pet = await this.petRepository.findById(petId);
        if (!pet) {
            throw new http_exception_1.HttpException(404, "Pet not found.");
        }
        const result = await this.generateJSON(compatibility_prompt_1.COMPATIBILITY_PROMPT, `USER

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
Health: ${pet.healthStatus}`, 0.3, 300);
        return {
            petId: pet._id.toString(),
            matchScore: result.score,
            reasons: result.reasons ?? [],
            concerns: result.concerns ?? [],
        };
    }
    // ─── Match Pets for User ──────────────────────────────────
    async matchPetsForUser(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found.");
        }
        const { pets } = await this.petRepository.findAll({ status: "AVAILABLE" }, 1, 100);
        if (!pets.length)
            return [];
        const matches = await Promise.all(pets.map((pet) => this.analyzeCompatibility(userId, pet._id.toString())));
        return matches
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10);
    }
    // ─── Personalized Recommendations ─────────────────────────
    async getPersonalizedRecommendations(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found.");
        }
        const { pets } = await this.petRepository.findAll({ status: "AVAILABLE" }, 1, 100);
        const recommendations = await Promise.all(pets.map(async (pet) => {
            const result = await this.generateJSON(recommendation_prompt_1.RECOMMENDATION_PROMPT, `USER

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
Health: ${pet.healthStatus}`, 0.3, 300);
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
        }));
        return recommendations
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 10);
    }
    // ─── Chat ─────────────────────────────────────────────────
    async getChatHistory(userId, sessionId, limit = 20) {
        return this.chatRepository.getConversation(userId, sessionId, limit);
    }
    async getChatSessions(userId) {
        return this.chatRepository.getSessions(userId);
    }
    async deleteChatSession(userId, sessionId) {
        await this.chatRepository.deleteSession(userId, sessionId);
    }
    async *chatStream(userId, sessionId, message) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found.");
        }
        await this.chatRepository.saveMessage(userId, sessionId, "user", message);
        const history = await this.chatRepository.getConversation(userId, sessionId, 20);
        const messages = [
            {
                role: "system",
                content: chatbot_prompt_1.CHATBOT_PROMPT,
            },
            ...history.map((item) => ({
                role: item.role,
                content: item.content,
            })),
        ];
        const stream = await openai_1.openai.chat.completions.create({
            model: constant_1.OPENAI_MODEL,
            messages,
            stream: true,
            temperature: 0.7,
        });
        let fullResponse = "";
        for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content;
            if (!token)
                continue;
            fullResponse += token;
            yield token;
        }
        await this.chatRepository.saveMessage(userId, sessionId, "assistant", fullResponse);
    }
    // ─── Shared JSON helper ───────────────────────────────────
    async generateJSON(systemPrompt, userPrompt, temperature = 0.3, maxTokens = 300) {
        const response = await openai_1.openai.chat.completions.create({
            model: constant_1.OPENAI_MODEL,
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
            throw new http_exception_1.HttpException(500, "OpenAI returned an empty response.");
        }
        return JSON.parse(content);
    }
}
exports.AIService = AIService;
