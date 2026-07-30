import { z } from "zod";

export const GeneratePetDescriptionDto = z.object({
  name: z.string(),
  species: z.enum(["DOG", "CAT"]),
  breed: z.string(),
  age: z.number(),
  description: z.string(),
  size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
  gender: z.enum(["MALE", "FEMALE"]),
  activityLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
  temperament: z.array(z.string()).default([]),
  goodWithKids: z.boolean(),
  goodWithPets: z.boolean(),
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  healthStatus: z.string(),
});

export type GeneratePetDescriptionDto = z.infer<
  typeof GeneratePetDescriptionDto
>;

export const PetRecommendationDto = z.object({
  petId: z.string().uuid(),
  name: z.string().max(100),
  species: z.enum(["DOG", "CAT"]),
  breed: z.string().max(100),
  age: z.number().min(0),
  image: z.string().url().optional(),
  matchScore: z.number().min(0).max(1),
  recommendation: z.string().max(200),
  reasons: z.array(z.string()).default([]),
  concerns: z.array(z.string()).default([])
});

export type PetRecommendationDto = z.infer<typeof PetRecommendationDto>;

export const AnalyzeCompatibilityDto = z.object({
  petId: z.string().min(1),
});

export type AnalyzeCompatibilityDto = z.infer<
  typeof AnalyzeCompatibilityDto
>;

export const ChatRequestDto = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1),
});

export type ChatRequestDto = z.infer<typeof ChatRequestDto>;