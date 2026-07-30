"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetSearchFiltersSchema = exports.PetSchema = exports.ActivityLevelSchema = exports.PetGenderSchema = exports.PetSizeSchema = exports.PetStatusSchema = exports.PetSpeciesSchema = void 0;
const zod_1 = require("zod");
exports.PetSpeciesSchema = zod_1.z.enum([
    "DOG",
    "CAT",
]);
exports.PetStatusSchema = zod_1.z.enum([
    "AVAILABLE",
    "PENDING",
    "ADOPTED",
]);
exports.PetSizeSchema = zod_1.z.enum([
    "SMALL",
    "MEDIUM",
    "LARGE",
]);
exports.PetGenderSchema = zod_1.z.enum([
    "MALE",
    "FEMALE",
]);
exports.ActivityLevelSchema = zod_1.z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
]);
exports.PetSchema = zod_1.z.object({
    _id: zod_1.z.string().optional(),
    name: zod_1.z.string().min(1),
    age: zod_1.z.coerce.number().nonnegative(),
    breed: zod_1.z.string().min(1),
    species: exports.PetSpeciesSchema,
    description: zod_1.z.string(),
    emoji: zod_1.z.string().default("🐾").optional(),
    status: exports.PetStatusSchema.default("AVAILABLE").optional(),
    size: exports.PetSizeSchema.default("MEDIUM").optional(),
    gender: exports.PetGenderSchema.default("MALE").optional(),
    location: zod_1.z.string().nullable().optional(),
    adoptionFee: zod_1.z.coerce.number().nonnegative().default(0).optional(),
    goodWithKids: zod_1.z.boolean().default(false).optional(),
    goodWithPets: zod_1.z.boolean().default(false).optional(),
    vaccinated: zod_1.z.boolean().default(false).optional(),
    neutered: zod_1.z.boolean().default(false).optional(),
    images: zod_1.z.array(zod_1.z.string()).default([]).optional(),
    healthStatus: zod_1.z.string().default("Healthy").optional(),
    temperament: zod_1.z.array(zod_1.z.string()).default([]).optional(),
    activityLevel: exports.ActivityLevelSchema.default("MEDIUM").optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.PetSearchFiltersSchema = zod_1.z.object({
    species: exports.PetSpeciesSchema.optional(),
    breed: zod_1.z.string().optional(),
    size: exports.PetSizeSchema.optional(),
    gender: exports.PetGenderSchema.optional(),
    status: exports.PetStatusSchema.optional(),
    goodWithKids: zod_1.z.boolean().optional(),
    goodWithPets: zod_1.z.boolean().optional(),
    location: zod_1.z.string().optional(),
    minAge: zod_1.z.number().optional(),
    maxAge: zod_1.z.number().optional(),
    minFee: zod_1.z.number().optional(),
    maxFee: zod_1.z.number().optional(),
});
