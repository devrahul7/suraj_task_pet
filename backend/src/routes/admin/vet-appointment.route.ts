import { Router } from "express";
import { VetAppointmentController } from "../../controllers/vet-appointment.controller";
import { authorizedMiddleware, isAdmin } from "../../middlewares/auth.middleware";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { UpdateAppointmentStatusDto } from "../../dtos/vet-appointment.dto";

const router = Router();
const vetAppointmentController = new VetAppointmentController();

// All routes below require admin auth
router.use(authorizedMiddleware, isAdmin);

// GET /api/v1/admin/appointments/statistics  ← must be before /:id
router.get("/statistics", vetAppointmentController.getStatistics);

// GET /api/v1/admin/appointments/recent  ← must be before /:id
router.get("/recent", vetAppointmentController.getRecentAppointments);

// GET /api/v1/admin/appointments?page=&limit=&status=&veterinarianId=
router.get("/", vetAppointmentController.getAllAppointments);

// PATCH /api/v1/admin/appointments/:id/status
router.patch(
    "/:id/status",
    validationMiddleware(UpdateAppointmentStatusDto),
    vetAppointmentController.updateAppointmentStatus
);

// DELETE /api/v1/admin/appointments/:id
router.delete("/:id", vetAppointmentController.deleteAppointment);

export default router;