import { z } from "zod";

export const PetSpeciesSchema = z.enum([
  "DOG",
  "CAT",
]);

export const PetStatusSchema = z.enum([
  "AVAILABLE",
  "PENDING",
  "ADOPTED",
]);

export const PetSizeSchema = z.enum([
  "SMALL",
  "MEDIUM",
  "LARGE",
]);

export const PetGenderSchema = z.enum([
  "MALE",
  "FEMALE",
]);

export const ActivityLevelSchema = z.enum([
  "LOW",
  "MEDIUM",
  "HIGH",
]);

export const PetSchema = z.object({
  _id: z.string().optional(),

  name: z.string().min(1),

  age: z.coerce.number().nonnegative(),

  breed: z.string().min(1),

  species: PetSpeciesSchema,

  description: z.string(),

  emoji: z.string().default("🐾").optional(),

  status: PetStatusSchema.default("AVAILABLE").optional(),

  size: PetSizeSchema.default("MEDIUM").optional(),

  gender: PetGenderSchema.default("MALE").optional(),

  location: z.string().nullable().optional(),

  adoptionFee: z.coerce.number().nonnegative().default(0).optional(),

  goodWithKids: z.boolean().default(false).optional(),

  goodWithPets: z.boolean().default(false).optional(),

  vaccinated: z.boolean().default(false).optional(),

  neutered: z.boolean().default(false).optional(),

  images: z.array(z.string()).default([]).optional(),

  healthStatus: z.string().default("Healthy").optional(),

  temperament: z.array(z.string()).default([]).optional(),

  activityLevel: ActivityLevelSchema.default("MEDIUM").optional(),

  createdAt: z.date().optional(),

  updatedAt: z.date().optional(),
});

export type PetType = z.infer<typeof PetSchema>;

export const PetSearchFiltersSchema = z.object({
  species: PetSpeciesSchema.optional(),

  breed: z.string().optional(),

  size: PetSizeSchema.optional(),

  gender: PetGenderSchema.optional(),

  status: PetStatusSchema.optional(),

  goodWithKids: z.boolean().optional(),

  goodWithPets: z.boolean().optional(),

  location: z.string().optional(),

  minAge: z.number().optional(),

  maxAge: z.number().optional(),

  minFee: z.number().optional(),

  maxFee: z.number().optional(),
});

export type PetSearchFilters = z.infer<typeof PetSearchFiltersSchema>;