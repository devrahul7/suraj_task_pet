import {z } from "zod";

export const BlogSchema =z.object({
    title: z.string(),
    content: z.string(),
    authorId: z.string(),
});

export type BlogType = z.infer<typeof BlogSchema>;