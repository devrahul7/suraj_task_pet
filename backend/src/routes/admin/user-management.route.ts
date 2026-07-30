import { Router } from "express";
import { AdminUserManagementController } from "../../controllers/admin/user-management.controller";
import {
  authorizedMiddleware,
  isAdmin,
} from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { SuspendUserDto } from "../../dtos/admin/user-management.dto";

const router = Router();
const controller = new AdminUserManagementController();

router.use(authorizedMiddleware, isAdmin);

router.get("/", controller.getUsersWithFilters);
router.get("/stats", controller.getUserManagementStats);
router.patch("/:id/suspend", validationMiddleware(SuspendUserDto), controller.suspendUser);
router.patch("/:id/activate", controller.activateUser);

export default router;
