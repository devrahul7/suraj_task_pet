"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VetAppointmentService = void 0;
const vet_appointment_repository_1 = require("../repositories/vet-appointment.repository");
const veterinarian_repository_1 = require("../repositories/veterinarian.repository");
const user_repository_1 = require("../repositories/user.repository");
const http_exception_1 = require("../exceptions/http-exception");
const email_service_1 = require("./email.service");
const notification_service_1 = require("./notification.service");
class VetAppointmentService {
    appointmentRepository;
    veterinarianRepository;
    userRepository;
    emailService;
    notificationService;
    constructor(appointmentRepository = new vet_appointment_repository_1.VetAppointmentRepository(), veterinarianRepository = new veterinarian_repository_1.VeterinarianRepository(), userRepository = new user_repository_1.UserRepository()) {
        this.appointmentRepository = appointmentRepository;
        this.veterinarianRepository = veterinarianRepository;
        this.userRepository = userRepository;
        this.emailService = new email_service_1.EmailService();
        this.notificationService = new notification_service_1.NotificationService();
    }
    // ─────────────────────────────────────────────
    // USER — Authenticated users
    // ─────────────────────────────────────────────
    /**
     * Book a vet appointment.
     * Business rules:
     * - Vet must exist and be active
     * - Appointment date must be in the future
     * - Time slot must fall within vet's availability window for that weekday
     * - Slot must not already be taken
     */
    async bookAppointment(userId, dto) {
        // 1. Verify user exists
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new http_exception_1.HttpException(404, "User not found");
        }
        // 2. Verify vet exists and is active
        const vet = await this.veterinarianRepository.findById(dto.veterinarianId);
        if (!vet) {
            throw new http_exception_1.HttpException(404, "Veterinarian not found");
        }
        if (!vet.isActive) {
            throw new http_exception_1.HttpException(400, "This veterinarian is not currently accepting appointments");
        }
        // 3. Appointment date must be in the future
        const appointmentDate = new Date(dto.appointmentDate);
        const now = new Date();
        now.setHours(0, 0, 0, 0); // compare date only, not time
        if (appointmentDate < now) {
            throw new http_exception_1.HttpException(400, "Appointment date must be in the future");
        }
        // 4. Validate timeSlot matches DTO format "HH:mm"
        const timeSlot = dto.timeSlot; // e.g. "09:00"
        // 5. Validate timeSlot is within vet's availability for that weekday
        this.validateSlotWithinAvailability(vet, appointmentDate, timeSlot);
        // 6. Check slot is not already booked
        const slotTaken = await this.appointmentRepository.isSlotTaken(dto.veterinarianId, appointmentDate, timeSlot);
        if (slotTaken) {
            throw new http_exception_1.HttpException(409, "This time slot is already booked. Please choose another.");
        }
        // 7. Create appointment
        const appointment = await this.appointmentRepository.create({
            userId: userId,
            veterinarianId: dto.veterinarianId,
            petName: dto.petName,
            petSpecies: dto.petSpecies,
            appointmentDate,
            timeSlot,
            reason: dto.reason,
            status: "PENDING",
        });
        // 8. Send confirmation email to user
        void this.emailService
            .sendBookingEmail({
            fullName: user.fullName,
            email: user.email,
        }, `Your appointment request with Dr. ${vet.name} on ${appointmentDate.toDateString()} at ${timeSlot} has been submitted successfully.`)
            .catch((error) => {
            console.warn("Appointment booking email delivery failed.", error);
        });
        // 9. Send notification email to the registered veterinarian
        void this.emailService
            .sendBookingEmail({
            fullName: vet.name,
            email: vet.email,
        }, `A new appointment request has been booked by ${user.fullName} for ${appointmentDate.toDateString()} at ${timeSlot}.`)
            .catch((error) => {
            console.warn("Veterinarian booking email delivery failed.", error);
        });
        // 10. Create in-app notification for the user
        void this.notificationService
            .createNotification(userId, "system", "Appointment Booked", `Your appointment with Dr. ${vet.name} on ${appointmentDate.toDateString()} at ${timeSlot} has been submitted. Awaiting confirmation.`, "/dashboard/user/appointments", { appointmentId: appointment._id?.toString() })
            .catch((error) => {
            console.warn("Failed to create user booking notification.", error);
        });
        return appointment;
    }
    /**
     * Get all appointments for the logged-in user with pagination.
     */
    async getMyAppointments(userId, page = 1, limit = 10) {
        const { appointments, total } = await this.appointmentRepository.findByUserId(userId, page, limit);
        return {
            appointments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Get a specific appointment by ID.
     * Users can only view their own appointments.
     */
    async getAppointmentById(id, userId, isAdmin = false) {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new http_exception_1.HttpException(404, "Appointment not found");
        }
        // Non-admin users can only access their own appointments
        if (!isAdmin && appointment.userId.toString() !== userId) {
            throw new http_exception_1.HttpException(403, "You do not have permission to view this appointment");
        }
        return appointment;
    }
    /**
     * Cancel an appointment.
     * Users can only cancel their own PENDING appointments.
     * Confirmed appointments can only be cancelled with a reason.
     */
    async cancelAppointment(id, userId, cancellationReason) {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new http_exception_1.HttpException(404, "Appointment not found");
        }
        // Ownership check
        if (appointment.userId.toString() !== userId) {
            throw new http_exception_1.HttpException(403, "You can only cancel your own appointments");
        }
        // Only PENDING appointments can be cancelled by users
        if (appointment.status !== "PENDING") {
            throw new http_exception_1.HttpException(400, `Cannot cancel a ${appointment.status.toLowerCase()} appointment`);
        }
        const updated = await this.appointmentRepository.update(id, {
            status: "CANCELLED",
            cancellationReason: cancellationReason ?? "Cancelled by user",
        });
        if (updated) {
            const user = await this.userRepository.findById(updated.userId.toString());
            const vet = await this.veterinarianRepository.findById(updated.veterinarianId.toString());
            if (user) {
                void this.emailService
                    .sendCancellationEmail({
                    fullName: user.fullName,
                    email: user.email,
                }, `Your appointment with ${vet?.name || "your veterinarian"} on ${updated.appointmentDate.toDateString()} at ${updated.timeSlot} has been cancelled.`)
                    .catch((error) => {
                    console.warn("User appointment cancellation email delivery failed.", error);
                });
                void this.notificationService
                    .createNotification(user._id.toString(), "system", "Appointment Cancelled", `Your appointment with ${vet?.name || "your veterinarian"} on ${updated.appointmentDate.toDateString()} at ${updated.timeSlot} has been cancelled.`, "/dashboard/user/appointments", { appointmentId: id })
                    .catch((error) => {
                    console.warn("Failed to create cancellation notification.", error);
                });
            }
            if (vet) {
                void this.emailService
                    .sendCancellationEmail({
                    fullName: vet.name,
                    email: vet.email,
                }, `An appointment with ${user?.fullName || "a user"} on ${updated.appointmentDate.toDateString()} at ${updated.timeSlot} has been cancelled.`)
                    .catch((error) => {
                    console.warn("Veterinarian appointment cancellation email delivery failed.", error);
                });
            }
        }
        return updated;
    }
    // ─────────────────────────────────────────────
    // ADMIN — Full control
    // ─────────────────────────────────────────────
    /**
     * Admin: Get all appointments with filters and pagination.
     */
    async getAllAppointments(page = 1, limit = 10, status, veterinarianId) {
        const { appointments, total } = await this.appointmentRepository.findAll({
            page,
            limit,
            status,
            veterinarianId,
        });
        return {
            appointments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }
    /**
     * Admin: Update appointment status (CONFIRMED, CANCELLED, COMPLETED).
     * Can also add admin notes and a cancellation reason.
     */
    async updateAppointmentStatus(id, dto) {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new http_exception_1.HttpException(404, "Appointment not found");
        }
        // Guard invalid transitions
        if (appointment.status === "COMPLETED") {
            throw new http_exception_1.HttpException(400, "Cannot change status of a completed appointment");
        }
        if (appointment.status === "CANCELLED") {
            throw new http_exception_1.HttpException(400, "Cannot change status of a cancelled appointment");
        }
        const updateData = {
            status: dto.status,
        };
        if (dto.adminNotes) {
            updateData.adminNotes = dto.adminNotes;
        }
        if (dto.status === "CANCELLED" && dto.cancellationReason) {
            updateData.cancellationReason = dto.cancellationReason;
        }
        const updated = await this.appointmentRepository.update(id, updateData);
        if (updated) {
            const user = await this.userRepository.findById(updated.userId.toString());
            const vet = await this.veterinarianRepository.findById(updated.veterinarianId.toString());
            if (user && vet) {
                const appointmentDetails = `Appointment with ${vet.name} on ${updated.appointmentDate.toDateString()} at ${updated.timeSlot}.`;
                if (dto.status === "CONFIRMED") {
                    void this.emailService
                        .sendApprovalEmail({
                        fullName: user.fullName,
                        email: user.email,
                    }, appointmentDetails)
                        .catch((error) => {
                        console.warn("Appointment approval email delivery failed.", error);
                    });
                    void this.notificationService
                        .createNotification(user._id.toString(), "system", "Appointment Confirmed", `Your appointment with ${vet.name} on ${updated.appointmentDate.toDateString()} at ${updated.timeSlot} has been confirmed.`, "/dashboard/user/appointments", { appointmentId: id })
                        .catch((error) => {
                        console.warn("Failed to create confirmation notification.", error);
                    });
                }
                if (dto.status === "CANCELLED") {
                    void this.emailService
                        .sendCancellationEmail({
                        fullName: user.fullName,
                        email: user.email,
                    }, dto.cancellationReason ? `${appointmentDetails} Reason: ${dto.cancellationReason}` : appointmentDetails)
                        .catch((error) => {
                        console.warn("Appointment cancellation email delivery failed.", error);
                    });
                    void this.notificationService
                        .createNotification(user._id.toString(), "system", "Appointment Cancelled", `Your appointment with ${vet.name} on ${updated.appointmentDate.toDateString()} at ${updated.timeSlot} has been cancelled.`, "/dashboard/user/appointments", { appointmentId: id })
                        .catch((error) => {
                        console.warn("Failed to create cancellation notification.", error);
                    });
                }
                if (dto.status === "COMPLETED") {
                    void this.emailService
                        .sendCompletionEmail({
                        fullName: user.fullName,
                        email: user.email,
                    }, appointmentDetails)
                        .catch((error) => {
                        console.warn("Appointment completion email delivery failed.", error);
                    });
                    void this.notificationService
                        .createNotification(user._id.toString(), "system", "Appointment Completed", `Your appointment with ${vet.name} on ${updated.appointmentDate.toDateString()} at ${updated.timeSlot} has been completed.`, "/dashboard/user/appointments", { appointmentId: id })
                        .catch((error) => {
                        console.warn("Failed to create completion notification.", error);
                    });
                }
            }
        }
        return updated;
    }
    /**
     * Admin: Delete an appointment record permanently.
     * Should only be used for data cleanup — prefer status updates.
     */
    async deleteAppointment(id) {
        const appointment = await this.appointmentRepository.findById(id);
        if (!appointment) {
            throw new http_exception_1.HttpException(404, "Appointment not found");
        }
        await this.appointmentRepository.delete(id);
        return { message: "Appointment deleted successfully" };
    }
    /**
     * Admin: Get recent appointments for dashboard.
     */
    async getRecentAppointments(limit = 10) {
        return this.appointmentRepository.getRecentAppointments(limit);
    }
    /**
     * Admin: Get appointment statistics broken down by status.
     */
    async getStatistics() {
        const byStatus = await this.appointmentRepository.countByStatus();
        const total = Object.values(byStatus).reduce((sum, count) => sum + count, 0);
        return {
            total,
            pending: byStatus["PENDING"] ?? 0,
            confirmed: byStatus["CONFIRMED"] ?? 0,
            completed: byStatus["COMPLETED"] ?? 0,
            cancelled: byStatus["CANCELLED"] ?? 0,
        };
    }
    // ─────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────
    /**
     * Validate that the requested timeSlot falls within the vet's
     * availability window for the weekday of the appointment.
     *
     * Example: vet is available MONDAY 09:00–17:00
     * A slot of "09:30" is valid; "08:00" or "17:30" is not.
     */
    validateSlotWithinAvailability(vet, appointmentDate, timeSlot) {
        const weekdays = [
            "SUNDAY",
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
        ];
        const dayName = weekdays[appointmentDate.getDay()];
        // Find all availability windows for that weekday
        const windows = vet.availability.filter((a) => a.day === dayName);
        if (windows.length === 0) {
            throw new http_exception_1.HttpException(400, `Veterinarian is not available on ${dayName}`);
        }
        const startPart = timeSlot.includes("-") ? timeSlot.split("-")[0] : timeSlot;
        const [slotH, slotM] = startPart.split(":").map(Number);
        const slotMinutes = slotH * 60 + slotM;
        // Check if slot falls within at least one availability window
        const isWithinWindow = windows.some((window) => {
            const [startH, startM] = window.startTime.split(":").map(Number);
            const [endH, endM] = window.endTime.split(":").map(Number);
            const start = startH * 60 + startM;
            const end = endH * 60 + endM;
            return slotMinutes >= start && slotMinutes < end;
        });
        if (!isWithinWindow) {
            throw new http_exception_1.HttpException(400, `Time slot ${timeSlot} is outside the veterinarian's availability on ${dayName}`);
        }
    }
}
exports.VetAppointmentService = VetAppointmentService;
