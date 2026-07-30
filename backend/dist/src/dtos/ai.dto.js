"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRequestDto = exports.AnalyzeCompatibilityDto = exports.PetRecommendationDto = exports.GeneratePetDescriptionDto = void 0;
const zod_1 = require("zod");
exports.GeneratePetDescriptionDto = zod_1.z.object({
    name: zod_1.z.string(),
    species: zod_1.z.enum(["DOG", "CAT"]),
    breed: zod_1.z.string(),
    age: zod_1.z.number(),
    description: zod_1.z.string(),
    size: zod_1.z.enum(["SMALL", "MEDIUM", "LARGE"]),
    gender: zod_1.z.enum(["MALE", "FEMALE"]),
    activityLevel: zod_1.z.enum(["LOW", "MEDIUM", "HIGH"]),
    temperament: zod_1.z.array(zod_1.z.string()).default([]),
    goodWithKids: zod_1.z.boolean(),
    goodWithPets: zod_1.z.boolean(),
    vaccinated: zod_1.z.boolean(),
    neutered: zod_1.z.boolean(),
    healthStatus: zod_1.z.string(),
});
exports.PetRecommendationDto = zod_1.z.object({
    petId: zod_1.z.string().uuid(),
    name: zod_1.z.string().max(100),
    species: zod_1.z.enum(["DOG", "CAT"]),
    breed: zod_1.z.string().max(100),
    age: zod_1.z.number().min(0),
    image: zod_1.z.string().url().optional(),
    matchScore: zod_1.z.number().min(0).max(1),
    recommendation: zod_1.z.string().max(200),
    reasons: zod_1.z.array(zod_1.z.string()).default([]),
    concerns: zod_1.z.array(zod_1.z.string()).default([])
});
exports.AnalyzeCompatibilityDto = zod_1.z.object({
    petId: zod_1.z.string().min(1),
});
exports.ChatRequestDto = zod_1.z.object({
    sessionId: zod_1.z.string().min(1),
    message: zod_1.z.string().min(1),
});
