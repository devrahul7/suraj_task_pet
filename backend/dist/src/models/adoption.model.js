"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Adoption = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const applicationDataSchema = new mongoose_1.Schema({
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
const adoptionSchema = new mongoose_1.Schema({
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
exports.Adoption = mongoose_1.default.model('Adoption', adoptionSchema);
