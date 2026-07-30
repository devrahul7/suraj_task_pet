import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export interface IAvailabilitySlot {
    day: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
    startTime: string; // HH:mm (24-hour)
    endTime: string; // HH:mm (24-hour)
}

export type IVeterinarianDocument =
    HydratedDocument<IVeterinarian>;


export interface IVeterinarian  {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    specializations: string[];
    about: string;
    location: string;
    profileImage?: string;
    experienceYears: number; // years
    rating: number;
    reviewCount: number;
    availability: IAvailabilitySlot[];
    isActive: boolean;
    consultationFee: number;
    createdAt: Date;
    updatedAt: Date;
}

const availabilitySlotSchema = new Schema<IAvailabilitySlot>(
    {
        day: {  
            type: String,
            enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
            required: true,
        },
        startTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
        endTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
    },
    { _id: false }
);

const veterinarianSchema = new Schema<IVeterinarian>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        phone: { type: String, required: true, trim: true },
        specializations: { type: [String], default: [] },
        about: { type: String, default: "" },
        location: { type: String, required: true, trim: true },
        profileImage: { type: String, default: null },
        experienceYears: { type: Number, default: 0, min: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0 },
        availability: { type: [availabilitySlotSchema], default: [] },
        isActive: { type: Boolean, default: true },
        consultationFee: { type: Number, default: 0 },
    },
    { timestamps: true, versionKey: false,toJSON: { virtuals: true }, toObject: { virtuals: true } }

);

veterinarianSchema.virtual("fullProfileImage").get(function () {
    if (!this.profileImage) {
        return null;
    }
    if (this.profileImage.startsWith("http")) {
        return this.profileImage;
    }
    // profileImage is already stored as a relative path (e.g. "/uploads/xyz.jpg"),
    // same convention used for pets, users, and blogs — return as-is.
    return this.profileImage;
});
veterinarianSchema.index({ isActive: 1, rating: -1 }); //fast lookup for active vets sorted by rating
veterinarianSchema.index({ specializations: 1 }); //fast lookup for vets by specialization
veterinarianSchema.index({ location: 1 }); //fast lookup for vets by location
veterinarianSchema.index({ consultationFee: 1 }); //fast lookup for vets by consultation fee
veterinarianSchema.index({ name: "text", about: "text", specializations: "text" }); //full-text search


export const Veterinarian = mongoose.model<IVeterinarian>("Veterinarian", veterinarianSchema);