import { Router } from "express";
import { VeterinarianController } from "../controllers/veterinarian.controller";

const router = Router();
const veterinarianController = new VeterinarianController();

// GET /api/v1/vets?page=1&limit=12&search=&specialization=&location=
router.get("/", veterinarianController.getVeterinarians);

// GET /api/v1/vets/:id
router.get("/:id", veterinarianController.getVeterinarianById);

export default router;