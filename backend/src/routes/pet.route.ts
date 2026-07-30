import { Router } from "express";
import { PetController } from "../controllers/pet.controller";

const router = Router();
const petController = new PetController();

router.get("/", petController.getAllPets);
router.get("/search", petController.searchPets);
router.get("/status/:status", petController.getPetsByStatus);
router.get("/species/:species", petController.getPetsBySpecies);
router.get("/breed/:breed", petController.getPetsByBreed);
router.get("/age/:age", petController.getPetsByAge);
router.get("/categories", petController.getCategories);
router.get("/:id", petController.getPetById);


export default router;

