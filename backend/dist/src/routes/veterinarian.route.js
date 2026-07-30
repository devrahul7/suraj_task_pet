"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const veterinarian_controller_1 = require("../controllers/veterinarian.controller");
const router = (0, express_1.Router)();
const veterinarianController = new veterinarian_controller_1.VeterinarianController();
// GET /api/v1/vets?page=1&limit=12&search=&specialization=&location=
router.get("/", veterinarianController.getVeterinarians);
// GET /api/v1/vets/:id
router.get("/:id", veterinarianController.getVeterinarianById);
exports.default = router;
