import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import {
  authorizedMiddleware,
  isAdmin,
} from "../middlewares/auth.middleware";
import { uploads } from "../middlewares/upload.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  RefreshTokenDto,
  ResetPasswordDto,
  VerifyEmailDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from "../dtos/user.dto";

const router = Router();
const userController = new UserController();

/**
 * Public Routes
 */
router.post(
    "/register",
  uploads.single("profileImage"),
  validationMiddleware(CreateUserDto),
    userController.registerUser
);

router.post(
    "/login",
    validationMiddleware(LoginUserDto),
    userController.loginUser
);

router.post(
  "/refresh-token",
  validationMiddleware(RefreshTokenDto),
  userController.refreshToken
);

router.post(
  "/logout",
  authorizedMiddleware,
  userController.logout
);

router.post(
  "/forgot-password",
  validationMiddleware(ForgotPasswordDto),
  userController.forgotPassword
);

router.post(
  "/reset-password",
  validationMiddleware(ResetPasswordDto),
  userController.resetPassword
);

router.post(
  "/verify-email",
  validationMiddleware(VerifyEmailDto),
  userController.verifyEmail
);

/**
 * User Routes
 */
router.get(
  "/me",
  authorizedMiddleware,
  userController.me
);

router.put(
  "/update",
  authorizedMiddleware,
  uploads.single("profileImage"),
  validationMiddleware(UpdateUserDto),
  userController.updateUser
);

router.patch(
  "/password",
  authorizedMiddleware,
  validationMiddleware(UpdatePasswordDto),
  userController.updatePassword
);

/**
 * Admin Routes
 */
router.get(
  "/admin/users",
  authorizedMiddleware,
  isAdmin,
  userController.getAllUsers.bind(userController)
);

export default router;