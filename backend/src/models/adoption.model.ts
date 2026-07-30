import mongoose, { Schema } from 'mongoose';
import { AdoptionType } from '../types/adoption.type';
import { Document } from 'mongoose';

const applicationDataSchema = new Schema({
  livingSpace: {
    type: String,
    required: true,
    enum: ['apartment', 'house', 'farm'],
  },
  hasYard: {
    type: Boolean,
    required: true,
  },
  householdMembers: {
    type: Number,
    required: true,
    min: 1,
  },
  hasChildren: {
    type: Boolean,
    required: true,
  },
  childrenAges: [{ type: Number }],
  hasOtherPets: {
    type: Boolean,
    required: true,
  },
  otherPetsDetails: { type: String },
  experience: {
    type: String,
    required: true,
    enum: ['none', 'beginner', 'intermediate', 'expert'],
  },
  workSchedule: {
    type: String,
    required: true,
  },
  reasonForAdoption: {
    type: String,
    required: true,
  },
  veterinarianInfo: { type: String },
  references: [{ type: String }],
}, { _id: false });

const adoptionSchema = new Schema<AdoptionType>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    ref: 'User',
  },
  petId: {
    type: String,
    required: [true, 'Pet ID is required'],
    ref: 'Pet',
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending',
  },
  applicationData: {
    type: applicationDataSchema,
    required: [true, 'Application data is required'],
  },
  aiMatchScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  adminNotes: {
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

adoptionSchema.index({ userId: 1, status: 1 });
adoptionSchema.index({ petId: 1, status: 1 });
adoptionSchema.index({ submittedAt: -1 });

export interface IAdoption
  extends AdoptionType,
    Document {}

export const Adoption = mongoose.model<AdoptionType>('Adoption', adoptionSchema);
