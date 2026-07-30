"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const veterinarian_controller_1 = require("../../controllers/veterinarian.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const veterinarian_dto_1 = require("../../dtos/veterinarian.dto");
const router = (0, express_1.Router)();
const veterinarianController = new veterinarian_controller_1.VeterinarianController();
// All routes below require admin auth
router.use(auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin);
// GET /api/v1/admin/vets/statistics  ← must be before /:id
router.get("/statistics", veterinarianController.getStatistics);
// GET /api/v1/admin/vets?page=&limit=&search=&specialization=&location=&isActive=
router.get("/", veterinarianController.getAdminVeterinarians);
// POST /api/v1/admin/vets
router.post("/", upload_middleware_1.uploads.single("profileImage"), (0, validation_middleware_1.validationMiddleware)(veterinarian_dto_1.CreateVeterinarianDto), veterinarianController.createVeterinarian);
// PUT /api/v1/admin/vets/:id
router.put("/:id", upload_middleware_1.uploads.single("profileImage"), (0, validation_middleware_1.validationMiddleware)(veterinarian_dto_1.UpdateVeterinarianDto), veterinarianController.updateVeterinarian);
// PATCH /api/v1/admin/vets/:id/toggle-active  ← must be before /:id/profile-image
router.patch("/:id/toggle-active", veterinarianController.toggleActive);
// PATCH /api/v1/admin/vets/:id/profile-image
router.patch("/:id/profile-image", upload_middleware_1.uploads.single("profileImage"), veterinarianController.updateProfileImage);
// DELETE /api/v1/admin/vets/:id
router.delete("/:id", veterinarianController.deleteVeterinarian);
exports.default = router;
