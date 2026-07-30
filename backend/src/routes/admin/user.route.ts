import { Router } from "express";
import { AdminUserController } from "../../controllers/admin/user.controller";
import { CreateUserDto, UpdateUserDto } from "../../dtos/user.dto";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import {
    authorizedMiddleware,
    isAdmin,
} from "../../middlewares/auth.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const router = Router();

const controller = new AdminUserController();

router.use(
    authorizedMiddleware,
    isAdmin
);

// Dashboard
router.get(
    "/stats",
    controller.getDashboardStats
);

// User CRUD
router.post(
    "/",
    uploads.single("profileImage"),
    validationMiddleware(CreateUserDto),
    controller.createUser
);

router.get(
    "/",
    controller.getUsers
);

router.get(
    "/:id",
    controller.getUserById
);

router.put(
    "/:id",
    uploads.single("profileImage"),
    validationMiddleware(UpdateUserDto),
    controller.updateUser
);

router.delete(
    "/:id",
    controller.deleteUser
);

router.patch(
    "/:id/role",
    controller.updateRole
);

export default router;