import mongoose, { Document, Schema, Types } from "mongoose";

export interface IChatMessage extends Document {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  sessionId: string;

  role: "user" | "assistant" | "system";

  content: string;

  timestamp: Date;

  createdAt: Date;

  updatedAt: Date;
}

const chatMessageSchema = new Schema<IChatMessage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

chatMessageSchema.index({
  userId: 1,
  sessionId: 1,
  timestamp: 1,
});

export const ChatMessage = mongoose.model<IChatMessage>(
  "ChatMessage",
  chatMessageSchema
);