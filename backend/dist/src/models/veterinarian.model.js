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
exports.Veterinarian = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const availabilitySlotSchema = new mongoose_1.Schema({
    day: {
        type: String,
        enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
        required: true,
    },
    startTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
    endTime: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
}, { _id: false });
const veterinarianSchema = new mongoose_1.Schema({
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
}, { timestamps: true, versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } });
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
exports.Veterinarian = mongoose_1.default.model("Veterinarian", veterinarianSchema);
