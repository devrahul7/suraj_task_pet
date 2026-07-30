import { Router } from "express";
import { VetAppointmentController } from "../controllers/vet-appointment.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import { BookAppointmentDto } from "../dtos/vet-appointment.dto";

const router = Router();
const vetAppointmentController = new VetAppointmentController();

// POST /api/v1/appointments  — book a new appointment
router.post(
    "/",
    authorizedMiddleware,
    validationMiddleware(BookAppointmentDto),
    vetAppointmentController.bookAppointment
);

// GET /api/v1/appointments/my  ← must be before /:id
router.get("/my", authorizedMiddleware, vetAppointmentController.getMyAppointments);

// GET /api/v1/appointments/:id
router.get("/:id", authorizedMiddleware, vetAppointmentController.getAppointmentById);

// PATCH /api/v1/appointments/:id/cancel
router.patch("/:id/cancel", authorizedMiddleware, vetAppointmentController.cancelAppointment);

export default router;