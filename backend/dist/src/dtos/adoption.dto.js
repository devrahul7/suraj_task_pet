"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteAdoptionDto = exports.RejectAdoptionDto = exports.ApproveAdoptionDto = exports.CreateAdoptionDto = void 0;
const zod_1 = require("zod");
exports.CreateAdoptionDto = zod_1.z.object({
    petId: zod_1.z.string(),
    applicationData: zod_1.z.object({
        livingSpace: zod_1.z.enum([
            "apartment",
            "house",
            "farm",
        ]),
        hasYard: zod_1.z.boolean(),
        householdMembers: zod_1.z.number(),
        hasChildren: zod_1.z.boolean(),
        childrenAges: zod_1.z.array(zod_1.z.number()).optional(),
        hasOtherPets: zod_1.z.boolean(),
        otherPetsDetails: zod_1.z.string().optional(),
        experience: zod_1.z.enum([
            "none",
            "beginner",
            "intermediate",
            "expert",
        ]),
        workSchedule: zod_1.z.string(),
        reasonForAdoption: zod_1.z.string(),
        veterinarianInfo: zod_1.z.string().optional(),
        references: zod_1.z.array(zod_1.z.string()).optional(),
    }),
});
exports.ApproveAdoptionDto = zod_1.z.object({
    adminNotes: zod_1.z.string().optional(),
});
exports.RejectAdoptionDto = zod_1.z.object({
    adminNotes: zod_1.z
        .string()
        .min(5, "Please provide a rejection reason."),
});
exports.CompleteAdoptionDto = zod_1.z.object({
    adminNotes: zod_1.z.string().optional(),
});
// export const UpdateAdoptionStatusDto = z.object({
//   status: z.enum([
//     "approved",
//     "rejected",
//     "completed",
//     "cancelled",
//   ]),
//   adminNotes: z.string().optional(),
// });
// export type UpdateAdoptionStatusDto =
//   z.infer<typeof UpdateAdoptionStatusDto>;
