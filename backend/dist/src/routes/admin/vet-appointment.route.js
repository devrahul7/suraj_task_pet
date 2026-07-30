"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vet_appointment_controller_1 = require("../../controllers/vet-appointment.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const validation_middleware_1 = require("../../middlewares/validation.middleware");
const vet_appointment_dto_1 = require("../../dtos/vet-appointment.dto");
const router = (0, express_1.Router)();
const vetAppointmentController = new vet_appointment_controller_1.VetAppointmentController();
// All routes below require admin auth
router.use(auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin);
// GET /api/v1/admin/appointments/statistics  ← must be before /:id
router.get("/statistics", vetAppointmentController.getStatistics);
// GET /api/v1/admin/appointments/recent  ← must be before /:id
router.get("/recent", vetAppointmentController.getRecentAppointments);
// GET /api/v1/admin/appointments?page=&limit=&status=&veterinarianId=
router.get("/", vetAppointmentController.getAllAppointments);
// PATCH /api/v1/admin/appointments/:id/status
router.patch("/:id/status", (0, validation_middleware_1.validationMiddleware)(vet_appointment_dto_1.UpdateAppointmentStatusDto), vetAppointmentController.updateAppointmentStatus);
// DELETE /api/v1/admin/appointments/:id
router.delete("/:id", vetAppointmentController.deleteAppointment);
exports.default = router;
