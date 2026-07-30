import { model, Schema, Document } from "mongoose";
import { BlogType } from "../types/blog.type";

export interface IBlog extends
    Omit<BlogType, "authorId">,
    Document {
    authorId: Schema.Types.ObjectId | string;
}

const BlogModelSchema: Schema = new Schema<IBlog>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true,
});
export const BlogModel = model<IBlog>("Blog", BlogModelSchema);