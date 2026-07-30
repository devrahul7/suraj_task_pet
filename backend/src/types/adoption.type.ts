export type AdoptionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed"
  | "cancelled";

export interface ApplicationData {
  livingSpace: "apartment" | "house" | "farm";
  hasYard: boolean;

  householdMembers: number;

  hasChildren: boolean;
  childrenAges?: number[];

  hasOtherPets: boolean;
  otherPetsDetails?: string;

  experience:
    | "none"
    | "beginner"
    | "intermediate"
    | "expert";

  workSchedule: string;

  reasonForAdoption: string;

  veterinarianInfo?: string;

  references?: string[];
}

export interface AdoptionType {
  userId: string;

  petId: string;

  status: AdoptionStatus;

  applicationData: ApplicationData;

  aiMatchScore?: number;

  adminNotes?: string;

  submittedAt?: Date;

  reviewedAt?: Date;

  completedAt?: Date;
}