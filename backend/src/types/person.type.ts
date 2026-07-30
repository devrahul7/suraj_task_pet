import { z } from "zod";

export const PersonSchema = z.object(
    {
        id: z.number(),
        name: z.string().min(1, "Name is required"),
        age: z.number().min(0, "Age must be a positive number")
    }
)
// Domain model - Person
export type Person = z.infer<typeof PersonSchema>;