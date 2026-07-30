"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../../controllers/admin/user.controller");
const user_dto_1 = require("../../dtos/user.dto");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const router = (0, express_1.Router)();
const controller = new user_controller_1.AdminUserController();
router.use(auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin);
// Dashboard
router.get("/stats", controller.getDashboardStats);
// User CRUD
router.post("/", upload_middleware_1.uploads.single("profileImage"), (0, validation_middleware_1.validationMiddleware)(user_dto_1.CreateUserDto), controller.createUser);
router.get("/", controller.getUsers);
router.get("/:id", controller.getUserById);
router.put("/:id", upload_middleware_1.uploads.single("profileImage"), (0, validation_middleware_1.validationMiddleware)(user_dto_1.UpdateUserDto), controller.updateUser);
router.delete("/:id", controller.deleteUser);
router.patch("/:id/role", controller.updateRole);
exports.default = router;
