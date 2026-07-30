import { Router } from "express";
import { AdoptionController } from "../controllers/adoption.controller";
import { authorizedMiddleware, isAdmin } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import {
  ApproveAdoptionDto,
  CompleteAdoptionDto,
  CreateAdoptionDto,
  RejectAdoptionDto,
} from "../dtos/adoption.dto";

const router = Router();
const adoptionController = new AdoptionController();

router.post(
  "/",
  authorizedMiddleware,
  validationMiddleware(CreateAdoptionDto),
  adoptionController.submitApplication
);

router.get(
  "/my",
  authorizedMiddleware,
  adoptionController.getMyApplications
);

router.get(
  "/statistics",
  authorizedMiddleware,
  isAdmin,
  adoptionController.getStatistics
);

router.get(
  "/pending",
  authorizedMiddleware,
  isAdmin,
  adoptionController.getPendingApplications
);

router.get(
  "/user/:userId",
  authorizedMiddleware,
  adoptionController.getApplicationsByUser
);

router.get(
  "/pet/:petId",
  authorizedMiddleware,
  adoptionController.getApplicationsByPet
);

router.get(
  "/:id",
  authorizedMiddleware,
  adoptionController.getApplicationById
);

router.patch(
  "/:id/cancel",
  authorizedMiddleware,
  adoptionController.cancelApplication
);

router.patch(
  "/:id/approve",
  authorizedMiddleware,
  isAdmin,
  validationMiddleware(ApproveAdoptionDto),
  adoptionController.approveApplication
);

router.patch(
  "/:id/reject",
  authorizedMiddleware,
  isAdmin,
  validationMiddleware(RejectAdoptionDto),
  adoptionController.rejectApplication
);

router.patch(
  "/:id/complete",
  authorizedMiddleware,
  isAdmin,
  validationMiddleware(CompleteAdoptionDto),
  adoptionController.completeAdoption
);

export default router;