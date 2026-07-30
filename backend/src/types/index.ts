// import { Request } from 'express';
// import { Document } from 'mongoose';

// export interface IUser extends Document {
//   _id: string;
//   name: string;
//   email: string;
//   password: string;
//   role: 'user' | 'admin';
//   phone?: string;
//   address?: string;
//   preferences?: IUserPreferences;
//   createdAt: Date;
//   updatedAt: Date;
//   comparePassword(candidatePassword: string): Promise<boolean>;
// }

// export interface IUserPreferences {
//   petType?: string[];
//   size?: string[];
//   age?: string;
//   activityLevel?: string;
//   experience?: string;
//   hasChildren?: boolean;
//   hasOtherPets?: boolean;
// }

// export interface IPet extends Document {
//   _id: string;
//   name: string;
//   species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
//   breed: string;
//   age: number;
//   size: 'small' | 'medium' | 'large';
//   gender: 'male' | 'female';
//   color: string;
//   description: string;
//   aiGeneratedDescription?: string;
//   healthStatus: string;
//   vaccinated: boolean;
//   neutered: boolean;
//   temperament: string[];
//   activityLevel: 'low' | 'medium' | 'high';
//   goodWithKids: boolean;
//   goodWithPets: boolean;
//   images: string[];
//   status: 'available' | 'pending' | 'adopted';
//   adoptionFee: number;
//   location: string;
//   shelterInfo?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface IAdoption extends Document {
//   _id: string;
//   userId: string;
//   petId: string;
//   status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
//   applicationData: IApplicationData;
//   aiMatchScore?: number;
//   adminNotes?: string;
//   submittedAt: Date;
//   reviewedAt?: Date;
//   completedAt?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// export interface IApplicationData {
//   livingSpace: 'apartment' | 'house' | 'farm';
//   hasYard: boolean;
//   householdMembers: number;
//   hasChildren: boolean;
//   childrenAges?: number[];
//   hasOtherPets: boolean;
//   otherPetsDetails?: string;
//   experience: 'none' | 'beginner' | 'intermediate' | 'expert';
//   workSchedule: string;
//   reasonForAdoption: string;
//   veterinarianInfo?: string;
//   references?: string[];
// }

// export interface IChatMessage extends Document {
//   _id: string;
//   userId: string;
//   sessionId: string;
//   role: 'user' | 'assistant' | 'system';
//   content: string;
//   timestamp: Date;
// }

// export interface AuthRequest extends Request {
//   user?: {
//     id: string;
//     role: string;
//   };
// }

// export interface ApiResponse<T = any> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   error?: string;
// }

// export interface PaginatedResponse<T> {
//   success: boolean;
//   data: T[];
//   pagination: {
//     page: number;
//     limit: number;
//     total: number;
//     pages: number;
//   };
// }

export interface ApiResponse<T = any> {
	success: boolean;
	message?: string;
	data?: T;
	error?: string;
}

export interface PaginatedResponse<T> {
	success: boolean;
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		pages: number;
	};
}

export interface AIMatchResult {
	petId: string;
	matchScore: number;
	reasons: string[];
	concerns?: string[];
}

// export interface PetSearchFilters {
//   species?: string;
//   breed?: string;
//   minAge?: number;
//   maxAge?: number;
//   size?: string;
//   gender?: string;
//   status?: string;
//   goodWithKids?: boolean;
//   goodWithPets?: boolean;
//   minFee?: number;
//   maxFee?: number;
//   location?: string;
// }
