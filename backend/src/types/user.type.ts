import { z } from "zod";

/**
 * User Preferences
 * Used by the AI recommendation engine
 */
export const UserPreferencesSchema = z.object({
  petType: z.array(z.string()).default([]),

  size: z.array(
    z.enum([
      "SMALL",
      "MEDIUM",
      "LARGE",
    ])
  ).default([]),

  age: z.string().nullable().optional(),

  activityLevel: z.enum([
    "LOW",
    "MEDIUM",
    "HIGH",
  ]).nullable().optional(),

  experience: z.enum([
    "BEGINNER",
    "INTERMEDIATE",
    "EXPERIENCED",
  ]).nullable().optional(),

  hasChildren: z.boolean().default(false),

  hasOtherPets: z.boolean().default(false),
});

/**
 * User Schema
 */
export const UserSchema = z.object({
  fullName: z.string().min(2),

  username: z.string().min(3),

  email: z.string().email(),

  password: z.string().min(6),

  phoneNumber: z.string().nullable().optional(),

  profileImage: z.string().nullable().optional(),

  address: z.string().max(200).nullable().optional(),

  location: z.string().max(100).nullable().optional(),

  role: z.enum([
    "USER",
    "ADMIN",
  ]).default("USER").optional(),

  preferences: UserPreferencesSchema.optional(),

  favorites: z.array(z.string()).default([]).optional(),

  tokenVersion: z.number().int().nonnegative().default(0).optional(),

  refreshTokenHash: z.string().nullable().optional(),

  refreshTokenExpiresAt: z.coerce.date().nullable().optional(),

  resetPasswordToken: z.string().nullable().optional(),

  resetPasswordExpiresAt: z.coerce.date().nullable().optional(),

  emailVerified: z.boolean().default(false).optional(),

  emailVerificationToken: z.string().nullable().optional(),

  emailVerificationExpiresAt: z.coerce.date().nullable().optional(),
});

export type UserType = z.infer<typeof UserSchema>;

export type UserPreferencesType = z.infer<typeof UserPreferencesSchema>;

export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];