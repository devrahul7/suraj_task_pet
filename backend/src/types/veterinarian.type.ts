export const WEEK_DAYS = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
] as const;

export type WeekDay = typeof WEEK_DAYS[number];

export interface IAvailabilitySlot {
    day: WeekDay;

    startTime: string; // HH:mm (24-hour)

    endTime: string; // HH:mm (24-hour)
}

export interface IVeterinarian {
    _id?: string;

    name: string;

    email: string;

    phone: string;

    specializations: string[];

    location?: string;

    profileImage?: string;

    experienceYears?: number;

    consultationFee: number;

    rating: number;

    availability: IAvailabilitySlot[];

    isActive: boolean;

    createdAt?: Date;

    updatedAt?: Date;
}