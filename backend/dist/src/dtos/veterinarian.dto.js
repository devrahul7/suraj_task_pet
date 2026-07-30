"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVeterinarianDto = exports.CreateVeterinarianDto = exports.AvailabilitySlotSchema = void 0;
const zod_1 = require("zod");
const veterinarian_type_1 = require("../types/veterinarian.type");
exports.AvailabilitySlotSchema = zod_1.z.object({
    day: zod_1.z.enum(veterinarian_type_1.WEEK_DAYS),
    startTime: zod_1.z
        .string()
        .regex(/^\d{2}:\d{2}$/),
    endTime: zod_1.z
        .string()
        .regex(/^\d{2}:\d{2}$/),
});
exports.CreateVeterinarianDto = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2)
        .max(100),
    email: zod_1.z
        .string()
        .email(),
    phone: zod_1.z
        .string()
        .min(7),
    specializations: zod_1.z
        .array(zod_1.z.string())
        .min(1),
    location: zod_1.z
        .string()
        .min(2),
    profileImage: zod_1.z
        .string()
        .optional(),
    experienceYears: zod_1.z
        .number()
        .int()
        .min(0)
        .default(0),
    consultationFee: zod_1.z
        .number()
        .min(0),
    rating: zod_1.z
        .number()
        .min(0)
        .max(5)
        .default(0),
    availability: zod_1.z
        .array(exports.AvailabilitySlotSchema),
    isActive: zod_1.z
        .boolean()
        .default(true),
});
exports.UpdateVeterinarianDto = exports.CreateVeterinarianDto.partial();
