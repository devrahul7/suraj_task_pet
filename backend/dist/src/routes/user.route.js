"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const user_dto_1 = require("../dtos/user.dto");
const router = (0, express_1.Router)();
const userController = new user_controller_1.UserController();
/**
 * Public Routes
 */
router.post("/register", upload_middleware_1.uploads.single("profileImage"), (0, validation_middleware_1.validationMiddleware)(user_dto_1.CreateUserDto), userController.registerUser);
router.post("/login", (0, validation_middleware_1.validationMiddleware)(user_dto_1.LoginUserDto), userController.loginUser);
router.post("/refresh-token", (0, validation_middleware_1.validationMiddleware)(user_dto_1.RefreshTokenDto), userController.refreshToken);
router.post("/logout", auth_middleware_1.authorizedMiddleware, userController.logout);
router.post("/forgot-password", (0, validation_middleware_1.validationMiddleware)(user_dto_1.ForgotPasswordDto), userController.forgotPassword);
router.post("/reset-password", (0, validation_middleware_1.validationMiddleware)(user_dto_1.ResetPasswordDto), userController.resetPassword);
router.post("/verify-email", (0, validation_middleware_1.validationMiddleware)(user_dto_1.VerifyEmailDto), userController.verifyEmail);
/**
 * User Routes
 */
router.get("/me", auth_middleware_1.authorizedMiddleware, userController.me);
router.put("/update", auth_middleware_1.authorizedMiddleware, upload_middleware_1.uploads.single("profileImage"), (0, validation_middleware_1.validationMiddleware)(user_dto_1.UpdateUserDto), userController.updateUser);
router.patch("/password", auth_middleware_1.authorizedMiddleware, (0, validation_middleware_1.validationMiddleware)(user_dto_1.UpdatePasswordDto), userController.updatePassword);
/**
 * Admin Routes
 */
router.get("/admin/users", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, userController.getAllUsers.bind(userController));
exports.default = router;
