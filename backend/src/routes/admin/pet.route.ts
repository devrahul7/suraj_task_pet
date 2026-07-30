import { Router } from "express";
import { PetController } from "../../controllers/pet.controller";
import {
  authorizedMiddleware,
  isAdmin,
} from "../../middlewares/auth.middleware";
import { CreatePetDTO, UpdatePetDTO } from "../../dtos/pet.dto";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { uploads } from "../../middlewares/upload.middleware";

const router = Router();
const petController = new PetController();

/**
 * Get all pets
 */
router.get(
  "/",
  authorizedMiddleware,
  isAdmin,
  petController.getAllPets
);

/**
 * Get pet by ID
 */
router.get(
  "/:id",
  authorizedMiddleware,
  isAdmin,
  petController.getPetById
);

/**
 * Create pet
 * image field name => image
 */
router.post(
  "/",
  authorizedMiddleware,
  isAdmin,
  uploads.array("images", 10),
  validationMiddleware(CreatePetDTO),
  petController.createPet
);

/**
 * Update pet
 */
router.put(
  "/:id",
  authorizedMiddleware,
  isAdmin,
  uploads.array("images", 10),
  validationMiddleware(UpdatePetDTO),
  petController.updatePet
);

/**
 * Delete pet
 */
router.delete(
  "/:id",
  authorizedMiddleware,
  isAdmin,
  petController.deletePet
);

/**
 * Update pet status
 */
router.patch(
  "/:id/status",
  authorizedMiddleware,
  isAdmin,
  validationMiddleware(UpdatePetDTO),
  petController.updatePetStatus
);

/**
 * Get pets by status
 */
router.get(
  "/status/:status",
  authorizedMiddleware,
  isAdmin,
  petController.getPetsByStatus
);

/**
 * Get pets by species
 */
router.get(
  "/species/:species",
  authorizedMiddleware,
  isAdmin,
  petController.getPetsBySpecies
);

/**
 * Get pets by breed
 */
router.get(
  "/breed/:breed",
  authorizedMiddleware,
  isAdmin,
  petController.getPetsByBreed
);

/**
 * Get pets by age
 */
router.get(
  "/age/:age",
  authorizedMiddleware,
  isAdmin,
  petController.getPetsByAge
);

router.get(
  "/stats/dashboard",
  authorizedMiddleware,
  isAdmin,
  petController.getDashboardStats
);
export default router;