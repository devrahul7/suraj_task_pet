import { z } from "zod";

export const BookAppointmentDto = z.object({

    veterinarianId: z.string().min(1, "Veterinarian ID is required"),

    petName: z //Since PetEy may later allow appointments for pets outside the adoption system
        .string()
        .min(2, "Pet name must be at least 2 characters"),

    petSpecies: z.enum([
        "DOG",
        "CAT",
    ]
    ),

    appointmentDate: z.coerce.date(),

    timeSlot: z
        .string()
        .regex(
            /^\d{2}:\d{2}-\d{2}:\d{2}$/, "Time slot must be in the format HH:mm-HH:mm. Example: 14:00-15:00"
        ),

    reason: z
        .string()
        .min(5, "Reason must be at least 5 characters")
        .max(500, "Reason must be at most 500 characters"),

});

export type BookAppointmentDto =
    z.infer<typeof BookAppointmentDto>;

export const UpdateAppointmentStatusDto =
    z.object({

        status: z.enum([
            "CONFIRMED",
            "CANCELLED",
            "COMPLETED",
        ]),

        adminNotes: z
            .string()
            .max(500, "Admin notes must be at most 500 characters")
            .optional(),

            //This is require wher status is CANCALLED
            cancellationReason: z
                .string()
                .max(500, "Cancellation reason must be at most 500 characters")
                .optional(),

    });

export type UpdateAppointmentStatusDto =
    z.infer<typeof UpdateAppointmentStatusDto>;