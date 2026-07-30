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
exports.PetModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PetModelSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
    versionKey: false,
});
exports.PetModel = mongoose_1.default.model("Pet", PetModelSchema);
exports.default = exports.PetModel;
