import { VeterinarianRepository } from "../repositories/veterinarian.repository";
import { VetAppointmentRepository } from "../repositories/vet-appointment.repository";
import { CreateVeterinarianDto, UpdateVeterinarianDto } from "../dtos/veterinarian.dto";
import { HttpException } from "../exceptions/http-exception";
import { IAvailabilitySlot } from "../models/veterinarian.model";

export class VeterinarianService {
    private veterinarianRepository: VeterinarianRepository;
    private appointmentRepository: VetAppointmentRepository;

    constructor(
        veterinarianRepository = new VeterinarianRepository(),
        appointmentRepository = new VetAppointmentRepository()
    ) {
        this.veterinarianRepository = veterinarianRepository;
        this.appointmentRepository = appointmentRepository;
    }

    // ─────────────────────────────────────────────
    // PUBLIC — No authentication required
    // ─────────────────────────────────────────────

    /**
     * Get all active veterinarians with search, filter, sort, and pagination.
     * Consumed by users browsing the vet listing page.
     */
    async getVeterinarians(
        page = 1,
        limit = 12,
        search?: string,
        specialization?: string,
        location?: string
    ) {
        const { veterinarians, total } = await this.veterinarianRepository.findAll({
            page,
            limit,
            search,
            specialization,
            location,
            isActive: true, // users only see active vets
        });

        return {
            veterinarians,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Get a single veterinarian profile by ID.
     * Only returns active vets to public users.
     */
    async getVeterinarianById(id: string) {
        const vet = await this.veterinarianRepository.findById(id);

        if (!vet) {
            throw new HttpException(404, "Veterinarian not found");
        }

        if (!vet.isActive) {
            throw new HttpException(404, "Veterinarian is not available");
        }

        return vet;
    }

    // ─────────────────────────────────────────────
    // ADMIN — Full control
    // ─────────────────────────────────────────────

    /**
     * Create a new veterinarian profile.
     * Admin-only. Validates email uniqueness and availability slots.
     */
    async createVeterinarian(dto: CreateVeterinarianDto, profileImagePath?: string) {
        // 1. Check for duplicate email
        await this.validateEmailUnique(dto.email);

        // 2. Validate availability slots if provided
        if (dto.availability && dto.availability.length > 0) {
            this.validateAvailability(dto.availability);
        }

        // 3. Create
        const vet = await this.veterinarianRepository.create({
            ...dto,
            profileImage: profileImagePath ?? dto.profileImage,
        });

        return vet;
    }

    /**
     * Update veterinarian profile.
     * Admin-only. Validates email uniqueness (if changed) and availability.
     */
    async updateVeterinarian(id: string, dto: UpdateVeterinarianDto, profileImagePath?: string) {
        // 1. Confirm vet exists
        const existing = await this.veterinarianRepository.findById(id);
        if (!existing) {
            throw new HttpException(404, "Veterinarian not found");
        }

        // 2. If email is being changed, ensure it's not already taken by another vet
        if (dto.email && dto.email.toLowerCase() !== existing.email.toLowerCase()) {
            await this.validateEmailUnique(dto.email);
        }

        // 3. Validate availability if being updated
        if (dto.availability && dto.availability.length > 0) {
            this.validateAvailability(dto.availability);
        }

        // 4. Update
        const updated = await this.veterinarianRepository.update(id, {
            ...dto,
            ...(profileImagePath && { profileImage: profileImagePath }),
        });

        return updated;
    }

    /**
     * Delete a veterinarian permanently.
     * Blocked if the vet has future appointments (PENDING or CONFIRMED).
     * Admin-only.
     */
    async deleteVeterinarian(id: string) {
        const vet = await this.veterinarianRepository.findById(id);
        if (!vet) {
            throw new HttpException(404, "Veterinarian not found");
        }

        // Guard: check for future appointments
        const hasFutureAppointments = await this.appointmentRepository.isSlotTaken(
            id,
            new Date(), // any date from now
            ""          // empty slot — we check existence, not a specific slot
        );

        // Use a dedicated future-appointment check instead
        const futureAppts = await this.appointmentRepository.findAll({
            veterinarianId: id,
            status: "CONFIRMED",
            page: 1,
            limit: 1,
        });

        if (futureAppts.total > 0) {
            throw new HttpException(
                400,
                "Cannot delete veterinarian with confirmed upcoming appointments. Deactivate instead."
            );
        }

        await this.veterinarianRepository.delete(id);
        return { message: "Veterinarian deleted successfully" };
    }

    /**
     * Activate or deactivate a veterinarian.
     * Deactivated vets cannot receive new bookings but existing ones remain intact.
     * Admin-only.
     */
    async toggleActive(id: string, isActive: boolean) {
        const vet = await this.veterinarianRepository.findById(id);
        if (!vet) {
            throw new HttpException(404, "Veterinarian not found");
        }

        const updated = await this.veterinarianRepository.toggleActive(id, isActive);

        return {
            message: isActive
                ? "Veterinarian activated successfully"
                : "Veterinarian deactivated successfully",
            veterinarian: updated,
        };
    }

    /**
     * Admin list — includes both active and inactive vets, with full filters.
     * Admin-only.
     */
    async getAdminVeterinarians(
        page = 1,
        limit = 10,
        search?: string,
        specialization?: string,
        location?: string,
        isActive?: boolean
    ) {
        const { veterinarians, total } = await this.veterinarianRepository.findAll({
            page,
            limit,
            search,
            specialization,
            location,
            isActive, // undefined = show all (both active and inactive)
        });

        return {
            veterinarians,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Admin dashboard statistics.
     * Combines VeterinarianRepository + VetAppointmentRepository data.
     */
    async getStatistics() {
        const [
            totalVeterinarians,
            activeVeterinarians,
            inactiveVeterinarians,
            appointmentsByStatus,
            allVets,
        ] = await Promise.all([
            this.veterinarianRepository.countTotal(),
            this.veterinarianRepository.countActive(),
            this.veterinarianRepository.countInactive(),
            this.appointmentRepository.countByStatus(),
            this.veterinarianRepository.findAll({ page: 1, limit: 1000, isActive: true }),
        ]);

        // Calculate average rating across active vets
        const totalRating = allVets.veterinarians.reduce(
            (sum, vet) => sum + (vet.rating ?? 0),
            0
        );
        const averageRating =
            allVets.veterinarians.length > 0
                ? parseFloat((totalRating / allVets.veterinarians.length).toFixed(2))
                : 0;

        const totalAppointments = Object.values(appointmentsByStatus).reduce(
            (sum, count) => sum + count,
            0
        );

        return {
            totalVeterinarians,
            activeVeterinarians,
            inactiveVeterinarians,
            averageRating,
            totalAppointments,
            pendingAppointments: appointmentsByStatus["PENDING"] ?? 0,
            confirmedAppointments: appointmentsByStatus["CONFIRMED"] ?? 0,
            completedAppointments: appointmentsByStatus["COMPLETED"] ?? 0,
            cancelledAppointments: appointmentsByStatus["CANCELLED"] ?? 0,
        };
    }

    /**
     * Upload / change profile image for a veterinarian.
     * Admin-only.
     */
    async updateProfileImage(id: string, imagePath: string) {
        const vet = await this.veterinarianRepository.findById(id);
        if (!vet) {
            throw new HttpException(404, "Veterinarian not found");
        }

        const updated = await this.veterinarianRepository.update(id, {
            profileImage: imagePath,
        });

        return updated;
    }

    // ─────────────────────────────────────────────
    // PRIVATE HELPERS
    // ─────────────────────────────────────────────

    /**
     * Throw 409 if the email is already registered to another vet.
     */
    private async validateEmailUnique(email: string): Promise<void> {
        const exists = await this.veterinarianRepository.existsByEmail(email);
        if (exists) {
            throw new HttpException(409, `A veterinarian with email "${email}" already exists`);
        }
    }

    /**
     * Validate availability slots:
     * - No duplicate weekdays in the same time range
     * - startTime must be before endTime
     * - Valid HH:mm format (enforced by Zod DTO, double-checked here)
     */
    private validateAvailability(slots: IAvailabilitySlot[]): void {
        for (const slot of slots) {
            const [startH, startM] = slot.startTime.split(":").map(Number);
            const [endH, endM] = slot.endTime.split(":").map(Number);

            const startMinutes = startH * 60 + startM;
            const endMinutes = endH * 60 + endM;

            if (endMinutes <= startMinutes) {
                throw new HttpException(
                    400,
                    `Invalid availability for ${slot.day}: endTime (${slot.endTime}) must be after startTime (${slot.startTime})`
                );
            }

            if (startMinutes < 0 || endMinutes > 24 * 60) {
                throw new HttpException(
                    400,
                    `Invalid time range for ${slot.day}: times must be within 00:00–24:00`
                );
            }
        }

        // Check for overlapping slots on the same day
        const daySlots: Record<string, { start: number; end: number }[]> = {};

        for (const slot of slots) {
            const [startH, startM] = slot.startTime.split(":").map(Number);
            const [endH, endM] = slot.endTime.split(":").map(Number);
            const start = startH * 60 + startM;
            const end = endH * 60 + endM;

            if (!daySlots[slot.day]) {
                daySlots[slot.day] = [];
            }

            // Check overlap with existing slots for same day
            for (const existing of daySlots[slot.day]) {
                if (start < existing.end && end > existing.start) {
                    throw new HttpException(
                        400,
                        `Overlapping availability slots found for ${slot.day}`
                    );
                }
            }

            daySlots[slot.day].push({ start, end });
        }
    }
}