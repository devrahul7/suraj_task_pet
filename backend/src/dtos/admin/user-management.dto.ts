import { z } from "zod";

export const SuspendUserDto = z.object({
  reason: z.string().min(3, "Suspension reason is required"),
});

export type SuspendUserDto = z.infer<typeof SuspendUserDto>;

export const SearchUsersDto = z.object({
  query: z.string().min(1),
  role: z.enum(["USER", "ADMIN"]).optional(),
  status: z.enum(["active", "suspended"]).optional(),
});

export type SearchUsersDto = z.infer<typeof SearchUsersDto>;
