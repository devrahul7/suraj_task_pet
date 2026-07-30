"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vet_appointment_controller_1 = require("../controllers/vet-appointment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const vet_appointment_dto_1 = require("../dtos/vet-appointment.dto");
const router = (0, express_1.Router)();
const vetAppointmentController = new vet_appointment_controller_1.VetAppointmentController();
// POST /api/v1/appointments  — book a new appointment
router.post("/", auth_middleware_1.authorizedMiddleware, (0, validation_middleware_1.validationMiddleware)(vet_appointment_dto_1.BookAppointmentDto), vetAppointmentController.bookAppointment);
// GET /api/v1/appointments/my  ← must be before /:id
router.get("/my", auth_middleware_1.authorizedMiddleware, vetAppointmentController.getMyAppointments);
// GET /api/v1/appointments/:id
router.get("/:id", auth_middleware_1.authorizedMiddleware, vetAppointmentController.getAppointmentById);
// PATCH /api/v1/appointments/:id/cancel
router.patch("/:id/cancel", auth_middleware_1.authorizedMiddleware, vetAppointmentController.cancelAppointment);
exports.default = router;
