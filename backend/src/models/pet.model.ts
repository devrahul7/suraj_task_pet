import mongoose, { Schema, Document } from "mongoose";
import { PetType } from "../types/pet.type";

export interface IPet extends Omit<PetType, "_id" | "createdAt" | "updatedAt">, Document {
  createdAt: Date;
  updatedAt: Date;
}

const PetModelSchema = new Schema<IPet>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 0,
    },

    breed: {
      type: String,
      required: true,
      trim: true,
    },

    species: {
      type: String,
      enum: ["DOG", "CAT"],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    emoji: {
      type: String,
      default: "🐾",
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "PENDING", "ADOPTED"],
      default: "AVAILABLE",
    },

    size: {
      type: String,
      enum: ["SMALL", "MEDIUM", "LARGE"],
      default: "MEDIUM",
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
      default: "MALE",
    },

    location: {
      type: String,
      default: null,
    },

    adoptionFee: {
      type: Number,
      default: 0,
    },

    goodWithKids: {
      type: Boolean,
      default: false,
    },

    goodWithPets: {
      type: Boolean,
      default: false,
    },

    vaccinated: {
      type: Boolean,
      default: false,
    },

    neutered: {
      type: Boolean,
      default: false,
    },

    images: {
      type: [String],
      default: [],
    },

    healthStatus: {
      type: String,
      default: "Healthy",
    },

    temperament: {
      type: [String],
      default: [],
    },

    activityLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "MEDIUM",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const PetModel = mongoose.model<IPet>("Pet", PetModelSchema);

export default PetModel;