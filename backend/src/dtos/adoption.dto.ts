import { z } from "zod";

export const CreateAdoptionDto = z.object({
  petId: z.string(),

  applicationData: z.object({
    livingSpace: z.enum([
      "apartment",
      "house",
      "farm",
    ]),

    hasYard: z.boolean(),

    householdMembers: z.number(),

    hasChildren: z.boolean(),

    childrenAges: z.array(z.number()).optional(),

    hasOtherPets: z.boolean(),

    otherPetsDetails: z.string().optional(),

    experience: z.enum([
      "none",
      "beginner",
      "intermediate",
      "expert",
    ]),

    workSchedule: z.string(),

    reasonForAdoption: z.string(),

    veterinarianInfo: z.string().optional(),

    references: z.array(z.string()).optional(),
  }),
});

export type CreateAdoptionDto =
  z.infer<typeof CreateAdoptionDto>;


export const ApproveAdoptionDto = z.object({
    adminNotes: z.string().optional(),
});

export type ApproveAdoptionDto =
    z.infer<typeof ApproveAdoptionDto>;


export const RejectAdoptionDto = z.object({
    adminNotes: z
        .string()
        .min(5, "Please provide a rejection reason."),
});

export type RejectAdoptionDto =
    z.infer<typeof RejectAdoptionDto>;


export const CompleteAdoptionDto = z.object({
    adminNotes: z.string().optional(),
});

export type CompleteAdoptionDto =
    z.infer<typeof CompleteAdoptionDto>;


  
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