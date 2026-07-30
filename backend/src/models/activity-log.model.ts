import mongoose, { Schema, Document } from "mongoose";

export type ActivityAction =
  | "create"
  | "update"
  | "delete"
  | "approve"
  | "reject"
  | "complete"
  | "cancel"
  | "suspend"
  | "activate"
  | "login"
  | "register"
  | "publish"
  | "unpublish"
  | "archive";

export type ActivityModule =
  | "user"
  | "pet"
  | "adoption"
  | "blog"
  | "ai"
  | "auth"
  | "system";

export interface IActivityLog extends Document {
  _id: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId | string;
  actorName: string;
  actorRole: string;
  module: ActivityModule;
  action: ActivityAction;
  description: string;
  entityId?: mongoose.Types.ObjectId | string;
  entityType?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actorName: {
      type: String,
      required: true,
    },
    actorRole: {
      type: String,
      enum: ["USER", "ADMIN"],
      required: true,
    },
    module: {
      type: String,
      enum: ["user", "pet", "adoption", "blog", "ai", "auth", "system"],
      required: true,
    },
    action: {
      type: String,
      enum: [
        "create",
        "update",
        "delete",
        "approve",
        "reject",
        "complete",
        "cancel",
        "suspend",
        "activate",
        "login",
        "register",
        "publish",
        "unpublish",
        "archive",
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    entityType: {
      type: String,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

activityLogSchema.index({ module: 1, action: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

export const ActivityLog = mongoose.model<IActivityLog>(
  "ActivityLog",
  activityLogSchema
);
