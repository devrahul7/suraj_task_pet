import { Router } from "express";
import { AdminAdoptionController } from "../../controllers/admin/adoption.controller";
import {
  authorizedMiddleware,
  isAdmin,
} from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import {
  BulkApproveDto,
  BulkRejectDto,
} from "../../dtos/admin/adoption.dto";

const router = Router();
const controller = new AdminAdoptionController();

router.use(authorizedMiddleware, isAdmin);

router.get("/stats", controller.getAdoptionStats);
router.get("/export", controller.exportAdoptionData);
router.get("/status/:status", controller.getApplicationsByStatus);
router.post(
  "/bulk-approve",
  validationMiddleware(BulkApproveDto),
  controller.bulkApprove
);
router.post(
  "/bulk-reject",
  validationMiddleware(BulkRejectDto),
  controller.bulkReject
);

export default router;
