import { z } from "zod";
import { UserSchema } from "../types/user.type";

/**
 * Create User
 */
export const CreateUserDto = UserSchema.pick({
  fullName: true,
  username: true,
  email: true,
  password: true,
  profileImage: true,
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;

/**
 * Login
 */
export const LoginUserDto = UserSchema.pick({
  email: true,
  password: true,
});

export type LoginUserDto = z.infer<typeof LoginUserDto>;

/**
 * Refresh Token
 */
export const RefreshTokenDto = z.object({
  refreshToken: z.string().min(1).optional(),
});

export type RefreshTokenDto = z.infer<typeof RefreshTokenDto>;

/**
 * Update Profile
 * Password is updated through a separate endpoint.
 */
export const UpdateUserDto = UserSchema.pick({
  fullName: true,
  username: true,
  email: true,
  phoneNumber: true,
  profileImage: true,
  address: true,
  location: true,
  preferences: true,
  favorites: true,
}).partial();

export type UpdateUserDto = z.infer<typeof UpdateUserDto>;

/**
 * Change Password
 */
export const UpdatePasswordDto = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type UpdatePasswordDto = z.infer<typeof UpdatePasswordDto>;

/**
 * Forgot Password
 */
export const ForgotPasswordDto = z.object({
  email: z.string().email(),
});

export type ForgotPasswordDto = z.infer<typeof ForgotPasswordDto>;

/**
 * Reset Password
 */
export const ResetPasswordDto = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordDto>;

/**
 * Verify Email
 */
export const VerifyEmailDto = z.object({
  token: z.string().min(1),
});

export type VerifyEmailDto = z.infer<typeof VerifyEmailDto>;