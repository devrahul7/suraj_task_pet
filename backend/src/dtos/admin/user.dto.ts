import { z } from "zod";

export const UpdateUserRoleDto = z.object({
    role: z.enum(["USER", "ADMIN"]),
});

export type UpdateUserRoleDto = z.infer<typeof UpdateUserRoleDto>;