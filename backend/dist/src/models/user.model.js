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
const mongoose_1 = __importStar(require("mongoose"));
const UserPreferencesSchema = new mongoose_1.Schema({
    petType: {
        type: [String],
        default: [],
    },
    size: {
        type: [String],
        default: [],
    },
    age: {
        type: String,
        default: null,
    },
    activityLevel: {
        type: String,
        default: null,
    },
    experience: {
        type: String,
        default: null,
    },
    hasChildren: {
        type: Boolean,
        default: false,
    },
    hasOtherPets: {
        type: Boolean,
        default: false,
    },
}, {
    _id: false,
});
const UserModelSchema = new mongoose_1.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    phoneNumber: {
        type: String,
        default: null,
    },
    profileImage: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        default: null,
    },
    location: {
        type: String,
        default: null,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
    preferences: {
        type: UserPreferencesSchema,
        default: {},
    },
    favorites: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Pet",
        },
    ],
    tokenVersion: {
        type: Number,
        default: 0,
    },
    refreshTokenHash: {
        type: String,
        default: null,
        select: false,
    },
    refreshTokenExpiresAt: {
        type: Date,
        default: null,
        select: false,
    },
    resetPasswordToken: {
        type: String,
        default: null,
        select: false,
    },
    resetPasswordExpiresAt: {
        type: Date,
        default: null,
        select: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
        default: null,
        select: false,
    },
    emailVerificationExpiresAt: {
        type: Date,
        default: null,
        select: false,
    },
    isSuspended: {
        type: Boolean,
        default: false,
    },
    suspensionReason: {
        type: String,
        default: null,
    },
    suspendedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const User = mongoose_1.default.model("User", UserModelSchema);
exports.default = User;
