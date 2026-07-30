import mongoose, { HydratedDocument, Schema, Types } from "mongoose";

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface IVetAppointment {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    veterinarianId: Types.ObjectId;
    petId?: Types.ObjectId;
    petName?: string;
    petSpecies?: "DOG" | "CAT";
    appointmentDate: Date;
    timeSlot: string; // e.g. "09:00"
    reason: string;
    ownerNotes?: string;
    adminNotes?: string;
    status: AppointmentStatus;
    cancellationReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type IVetAppointmentDocument = HydratedDocument<IVetAppointment>;

const vetAppointmentSchema = new Schema<IVetAppointment>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        veterinarianId: { type: Schema.Types.ObjectId, ref: "Veterinarian", required: true },
        petId: { type: Schema.Types.ObjectId, ref: "Pet", default: null },
        petName: { type: String, default: null },
        petSpecies: { type: String, default: null },
        appointmentDate: { type: Date, required: true },
        timeSlot: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
        reason: { type: String, required: true },
        ownerNotes: { type: String, default: null },
        adminNotes: { type: String, default: null },
        status: {
            type: String,
            enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
            default: "PENDING",
        },
        cancellationReason: { type: String, default: null },
    },
    { timestamps: true, versionKey: false }
);
vetAppointmentSchema.index({ veterinarianId: 1, appointmentDate: 1, timeSlot: 1 }, { unique: true });

vetAppointmentSchema.index({ userId: 1, status: 1 });
vetAppointmentSchema.index({ veterinarianId: 1, appointmentDate: 1 });
vetAppointmentSchema.index({ status: 1, createdAt: -1 });

export const VetAppointment = mongoose.model<IVetAppointment>("VetAppointment", vetAppointmentSchema);
