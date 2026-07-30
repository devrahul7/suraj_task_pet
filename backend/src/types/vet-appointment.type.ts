export const AppointmentStatus = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
] as const;

export type AppointmentStatusType = typeof AppointmentStatus[number];

export const PET_SPECIES = ["DOG", "CAT"] as const;

export type PetSpeciesType = typeof PET_SPECIES[number];
export interface IVetAppointment {
    _id?: string;
    userId: string;
    veterinarianId: string;
    vetId?: string;
    petName: string;
    petSpecies: PetSpeciesType;
    appointmentDate: Date;
    timeSlot: string; // e.g. "10:00-10:30"
    reason: string;
    status: AppointmentStatusType;
    adminNotes?: string;
    createdAt?: Date;
    updatedAt?: Date;
}