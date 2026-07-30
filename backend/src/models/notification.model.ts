import mongoose, { Schema, Document } from "mongoose";

export type NotificationType =
  | "adoption_submitted"
  | "adoption_approved"
  | "adoption_rejected"
  | "adoption_completed"
  | "blog_published"
  | "blog_unpublished"
  | "user_suspended"
  | "user_activated"
  | "user_role_changed"
  | "pet_created"
  | "pet_archived"
  | "system";

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        "adoption_submitted",
        "adoption_approved",
        "adoption_rejected",
        "adoption_completed",
        "blog_published",
        "blog_unpublished",
        "user_suspended",
        "user_activated",
        "user_role_changed",
        "pet_created",
        "pet_archived",
        "system",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
