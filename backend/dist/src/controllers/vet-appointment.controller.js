"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VetAppointmentController = void 0;
const vet_appointment_service_1 = require("../services/vet-appointment.service");
const api_response_1 = require("../utils/api-response");
const vetAppointmentService = new vet_appointment_service_1.VetAppointmentService();
class VetAppointmentController {
    // ─────────────────────────────────────────────
    // USER
    // ─────────────────────────────────────────────
    /**
     * USER
     * POST /api/v1/appointments
     * Book a new vet appointment
     *
     * NOTE: The BookAppointmentDto validates timeSlot as "HH:mm-HH:mm"
     * (e.g. "09:00-10:00"), but the service's availability validator
     * internally reads only the start time portion ("09:00"). This is
     * handled inside the service — just pass req.body as-is.
     */
    async bookAppointment(req, res) {
        try {
            const appointment = await vetAppointmentService.bookAppointment(req.user.id, req.body);
            return api_response_1.ApiResponseHelper.success(res, appointment, 201, "Appointment booked successfully. Awaiting confirmation.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * USER
     * GET /api/v1/appointments/my
     * Get the logged-in user's appointments with pagination
     */
    async getMyAppointments(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await vetAppointmentService.getMyAppointments(req.user.id, page, limit);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Appointments retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * USER / ADMIN
     * GET /api/v1/appointments/:id
     * Get a single appointment — users can only access their own
     */
    async getAppointmentById(req, res) {
        try {
            const isAdmin = req.user.role === "ADMIN";
            const appointment = await vetAppointmentService.getAppointmentById(req.params.id, req.user.id, isAdmin);
            return api_response_1.ApiResponseHelper.success(res, appointment, 200, "Appointment retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * USER
     * PATCH /api/v1/appointments/:id/cancel
     * Cancel own PENDING appointment
     * Body: { cancellationReason?: string }
     */
    async cancelAppointment(req, res) {
        try {
            const { cancellationReason } = req.body;
            const appointment = await vetAppointmentService.cancelAppointment(req.params.id, req.user.id, cancellationReason);
            return api_response_1.ApiResponseHelper.success(res, appointment, 200, "Appointment cancelled successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    // ─────────────────────────────────────────────
    // ADMIN
    // ─────────────────────────────────────────────
    /**
     * ADMIN
     * GET /api/v1/admin/appointments
     * List all appointments with filters
     * Query: page, limit, status (PENDING|CONFIRMED|CANCELLED|COMPLETED), veterinarianId
     */
    async getAllAppointments(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const status = req.query.status;
            const veterinarianId = req.query.veterinarianId;
            const result = await vetAppointmentService.getAllAppointments(page, limit, status, veterinarianId);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Appointments retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * ADMIN
     * PATCH /api/v1/admin/appointments/:id/status
     * Update appointment status (CONFIRMED / CANCELLED / COMPLETED)
     * Body: { status, adminNotes?, cancellationReason? }
     */
    async updateAppointmentStatus(req, res) {
        try {
            const appointment = await vetAppointmentService.updateAppointmentStatus(req.params.id, req.body);
            return api_response_1.ApiResponseHelper.success(res, appointment, 200, "Appointment status updated successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * ADMIN
     * DELETE /api/v1/admin/appointments/:id
     * Permanently delete an appointment record
     */
    async deleteAppointment(req, res) {
        try {
            const result = await vetAppointmentService.deleteAppointment(req.params.id);
            return api_response_1.ApiResponseHelper.success(res, result, 200, result.message);
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * ADMIN
     * GET /api/v1/admin/appointments/recent
     * Get recent appointments for dashboard (default: last 10)
     */
    async getRecentAppointments(req, res) {
        try {
            const limit = Number(req.query.limit) || 10;
            const appointments = await vetAppointmentService.getRecentAppointments(limit);
            return api_response_1.ApiResponseHelper.success(res, appointments, 200, "Recent appointments retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * ADMIN
     * GET /api/v1/admin/appointments/statistics
     * Get appointment counts broken down by status
     */
    async getStatistics(req, res) {
        try {
            const stats = await vetAppointmentService.getStatistics();
            return api_response_1.ApiResponseHelper.success(res, stats, 200, "Appointment statistics retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
}
exports.VetAppointmentController = VetAppointmentController;
