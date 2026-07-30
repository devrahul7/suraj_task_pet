"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAppointmentStatusDto = exports.BookAppointmentDto = void 0;
const zod_1 = require("zod");
exports.BookAppointmentDto = zod_1.z.object({
    veterinarianId: zod_1.z.string().min(1, "Veterinarian ID is required"),
    petName: zod_1.z //Since PetEy may later allow appointments for pets outside the adoption system
        .string()
        .min(2, "Pet name must be at least 2 characters"),
    petSpecies: zod_1.z.enum([
        "DOG",
        "CAT",
    ]),
    appointmentDate: zod_1.z.coerce.date(),
    timeSlot: zod_1.z
        .string()
        .regex(/^\d{2}:\d{2}-\d{2}:\d{2}$/, "Time slot must be in the format HH:mm-HH:mm. Example: 14:00-15:00"),
    reason: zod_1.z
        .string()
        .min(5, "Reason must be at least 5 characters")
        .max(500, "Reason must be at most 500 characters"),
});
exports.UpdateAppointmentStatusDto = zod_1.z.object({
    status: zod_1.z.enum([
        "CONFIRMED",
        "CANCELLED",
        "COMPLETED",
    ]),
    adminNotes: zod_1.z
        .string()
        .max(500, "Admin notes must be at most 500 characters")
        .optional(),
    //This is require wher status is CANCALLED
    cancellationReason: zod_1.z
        .string()
        .max(500, "Cancellation reason must be at most 500 characters")
        .optional(),
});
