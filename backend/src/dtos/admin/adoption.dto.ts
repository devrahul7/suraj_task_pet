import { z } from "zod";

export const BulkRejectDto = z.object({
  applicationIds: z.array(z.string().min(1)).min(1),
  adminNotes: z.string().optional(),
});

export type BulkRejectDto = z.infer<typeof BulkRejectDto>;

export const BulkApproveDto = z.object({
  applicationIds: z.array(z.string().min(1)).min(1),
  adminNotes: z.string().optional(),
});

export type BulkApproveDto = z.infer<typeof BulkApproveDto>;
