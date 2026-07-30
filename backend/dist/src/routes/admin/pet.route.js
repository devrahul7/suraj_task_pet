"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pet_controller_1 = require("../../controllers/pet.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const pet_dto_1 = require("../../dtos/pet.dto");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const upload_middleware_1 = require("../../middlewares/upload.middleware");
const router = (0, express_1.Router)();
const petController = new pet_controller_1.PetController();
/**
 * Get all pets
 */
router.get("/", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, petController.getAllPets);
/**
 * Get pet by ID
 */
router.get("/:id", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, petController.getPetById);
/**
 * Create pet
 * image field name => image
 */
router.post("/", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, upload_middleware_1.uploads.array("images", 10), (0, validation_middleware_1.validationMiddleware)(pet_dto_1.CreatePetDTO), petController.createPet);
/**
 * Update pet
 */
router.put("/:id", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, upload_middleware_1.uploads.array("images", 10), (0, validation_middleware_1.validationMiddleware)(pet_dto_1.UpdatePetDTO), petController.updatePet);
/**
 * Delete pet
 */
router.delete("/:id", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, petController.deletePet);
/**
 * Update pet status
 */
router.patch("/:id/status", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, (0, validation_middleware_1.validationMiddleware)(pet_dto_1.UpdatePetDTO), petController.updatePetStatus);
/**
 * Get pets by status
 */
router.get("/status/:status", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, petController.getPetsByStatus);
/**
 * Get pets by species
 */
router.get("/species/:species", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, petController.getPetsBySpecies);
/**
 * Get pets by breed
 */
router.get("/breed/:breed", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, petController.getPetsByBreed);
/**
 * Get pets by age
 */
router.get("/age/:age", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, petController.getPetsByAge);
router.get("/stats/dashboard", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, petController.getDashboardStats);
exports.default = router;
