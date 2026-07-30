import mongoose, { Document, Schema } from "mongoose";
import { UserType } from "../types/user.type";

export interface IUser extends UserType, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isSuspended?: boolean;
  suspensionReason?: string | null;
  suspendedAt?: Date | null;
}

const UserPreferencesSchema = new Schema(
  {
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
  },
  {
    _id: false,
  }
);

const UserModelSchema = new Schema<IUser>(
  {
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
        type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model<IUser>("User", UserModelSchema);

export default User;
