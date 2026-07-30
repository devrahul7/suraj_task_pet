import { z } from "zod";
import { WEEK_DAYS } from "../types/veterinarian.type";

export const AvailabilitySlotSchema = z.object({

    day: z.enum(WEEK_DAYS),

    startTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/),

    endTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/),

});

export const CreateVeterinarianDto = z.object({

    name: z
        .string()
        .min(2)
        .max(100),

    email: z
        .string()
        .email(),

    phone: z
        .string()
        .min(7),

    specializations: z
        .array(z.string())
        .min(1),

    location: z
        .string()
        .min(2),

    profileImage: z
        .string()
        .optional(),

    experienceYears: z
        .number()
        .int()
        .min(0)
        .default(0),

    consultationFee: z
        .number()
        .min(0),

    rating: z
        .number()
        .min(0)
        .max(5)
        .default(0),

    availability: z
        .array(AvailabilitySlotSchema),

    isActive: z
        .boolean()
        .default(true),

});

export type CreateVeterinarianDto =
    z.infer<typeof CreateVeterinarianDto>;

export const UpdateVeterinarianDto =
    CreateVeterinarianDto.partial();

export type UpdateVeterinarianDto =
    z.infer<typeof UpdateVeterinarianDto>;