import { Router } from "express";
import { VeterinarianController } from "../../controllers/veterinarian.controller";
import { authorizedMiddleware, isAdmin } from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { uploads } from "../../middlewares/upload.middleware";
import {
    CreateVeterinarianDto,
    UpdateVeterinarianDto,
} from "../../dtos/veterinarian.dto";

const router = Router();
const veterinarianController = new VeterinarianController();

// All routes below require admin auth
router.use(authorizedMiddleware, isAdmin);

// GET /api/v1/admin/vets/statistics  ← must be before /:id
router.get("/statistics", veterinarianController.getStatistics);

// GET /api/v1/admin/vets?page=&limit=&search=&specialization=&location=&isActive=
router.get("/", veterinarianController.getAdminVeterinarians);

// POST /api/v1/admin/vets
router.post(
    "/",
    uploads.single("profileImage"),
    validationMiddleware(CreateVeterinarianDto),
    veterinarianController.createVeterinarian
);

// PUT /api/v1/admin/vets/:id
router.put(
    "/:id",
    uploads.single("profileImage"),
    validationMiddleware(UpdateVeterinarianDto),
    veterinarianController.updateVeterinarian
);

// PATCH /api/v1/admin/vets/:id/toggle-active  ← must be before /:id/profile-image
router.patch("/:id/toggle-active", veterinarianController.toggleActive);

// PATCH /api/v1/admin/vets/:id/profile-image
router.patch(
    "/:id/profile-image",
    uploads.single("profileImage"),
    veterinarianController.updateProfileImage
);

// DELETE /api/v1/admin/vets/:id
router.delete("/:id", veterinarianController.deleteVeterinarian);

export default router;