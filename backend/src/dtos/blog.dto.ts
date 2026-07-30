import { BlogSchema } from "../types/blog.type";
import { z } from "zod";
export const CreateBlogDTO = BlogSchema.pick({
    title: true,
    content: true,
    authorId:true
});
export const UpdateBlogDTO = BlogSchema.partial().pick({
    title: true,
    content: true,
});
export type CreateBlogDTO = z.infer<typeof CreateBlogDTO>;
export type UpdateBlogDTO = z.infer<typeof UpdateBlogDTO>;