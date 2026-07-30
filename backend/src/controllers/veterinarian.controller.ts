import { Request, Response } from "express";
import { VeterinarianService } from "../services/veterinarian.service";
import { ApiResponseHelper } from "../utils/api-response";

const veterinarianService = new VeterinarianService();

export class VeterinarianController {

    /**
     * PUBLIC
     * GET /api/v1/vets
     * List all active veterinarians with search, filter, pagination
     */
    async getVeterinarians(req: Request, res: Response) {
        try {
            const page          = Number(req.query.page)   || 1;
            const limit         = Number(req.query.limit)  || 12;
            const search        = req.query.search        as string | undefined;
            const specialization = req.query.specialization as string | undefined;
            const location      = req.query.location      as string | undefined;

            const result = await veterinarianService.getVeterinarians(
                page, limit, search, specialization, location
            );

            return ApiResponseHelper.success(
                res, result, 200, "Veterinarians retrieved successfully."
            );
        } catch (e: any) {
            return ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }

    /**
     * PUBLIC
     * GET /api/v1/vets/:id
     * Get a single active veterinarian profile
     */
    async getVeterinarianById(req: Request, res: Response) {
        try {
            const vet = await veterinarianService.getVeterinarianById(req.params.id);

            return ApiResponseHelper.success(
                res, vet, 200, "Veterinarian retrieved successfully."
            );
        } catch (e: any) {
            return ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }

    // ─────────────────────────────────────────────
    // ADMIN
    // ─────────────────────────────────────────────

    /**
     * ADMIN
     * GET /api/v1/admin/vets
     * List all vets (active + inactive) with full filters
     */
    async getAdminVeterinarians(req: Request, res: Response) {
        try {
            const page           = Number(req.query.page)   || 1;
            const limit          = Number(req.query.limit)  || 10;
            const search         = req.query.search         as string | undefined;
            const specialization = req.query.specialization as string | undefined;
            const location       = req.query.location       as string | undefined;
            const isActiveQuery  = req.query.isActive;

            // Convert isActive query string → boolean | undefined
            let isActive: boolean | undefined;
            if (isActiveQuery === "true")  isActive = true;
            if (isActiveQuery === "false") isActive = false;

            const result = await veterinarianService.getAdminVeterinarians(
                page, limit, search, specialization, location, isActive
            );

            return ApiResponseHelper.success(
                res, result, 200, "Veterinarians retrieved successfully."
            );
        } catch (e: any) {
            return ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }

    /**
     * ADMIN
     * GET /api/v1/admin/vets/statistics
     */
    async getStatistics(req: Request, res: Response) {
        try {
            const stats = await veterinarianService.getStatistics();

            return ApiResponseHelper.success(
                res, stats, 200, "Statistics retrieved successfully."
            );
        } catch (e: any) {
            return ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }

    /**
     * ADMIN
     * POST /api/v1/admin/vets
     * Create a new veterinarian (optional profileImage upload)
     */
    async createVeterinarian(req: Request, res: Response) {
        try {
            const profileImagePath = req.file
                ? "/uploads/" + req.file.filename
                : undefined;

            const vet = await veterinarianService.createVeterinarian(
                req.body, profileImagePath
            );

            return ApiResponseHelper.success(
                res, vet, 201, "Veterinarian created successfully."
            );
        } catch (e: any) {
            return ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }

    /**
     * ADMIN
     * PUT /api/v1/admin/vets/:id
     * Update veterinarian details (optional profileImage upload)
     */
    async updateVeterinarian(req: Request, res: Response) {
        try {
            const profileImagePath = req.file
                ? "/uploads/" + req.file.filename
                : undefined;

            const vet = await veterinarianService.updateVeterinarian(
                req.params.id, req.body, profileImagePath
            );

            return ApiResponseHelper.success(
                res, vet, 200, "Veterinarian updated successfully."
            );
        } catch (e: any) {
            return ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }

    /**
     * ADMIN
     * DELETE /api/v1/admin/vets/:id
     * Permanently delete — blocked if confirmed appointments exist
     */
    async deleteVeterinarian(req: Request, res: Response) {
        try {
            const result = await veterinarianService.deleteVeterinarian(req.params.id);

            return ApiResponseHelper.success(
                res, result, 200, result.message
            );
        } catch (e: any) {
            return ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }

    /**
     * ADMIN
     * PATCH /api/v1/admin/vets/:id/toggle-active
     * Activate or deactivate a veterinarian
     * Body: { isActive: boolean }
     */
    async toggleActive(req: Request, res: Response) {
        try {
            const { isActive } = req.body;

            if (typeof isActive !== "boolean") {
                return ApiResponseHelper.error(
                    res, "isActive must be a boolean value (true or false)", 400
                );
            }

            const result = await veterinarianService.toggleActive(
                req.params.id, isActive
            );

            return ApiResponseHelper.success(
                res, result, 200, result.message
            );
        } catch (e: any) {
            return ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }

    /**
     * ADMIN
     * PATCH /api/v1/admin/vets/:id/profile-image
     * Upload / replace profile image only
     */
    async updateProfileImage(req: Request, res: Response) {
        try {
            if (!req.file) {
                return ApiResponseHelper.error(res, "No image file uploaded", 400);
            }

            const imagePath = "/uploads/" + req.file.filename;
            const vet = await veterinarianService.updateProfileImage(
                req.params.id, imagePath
            );

            return ApiResponseHelper.success(
                res, vet, 200, "Profile image updated successfully."
            );
        } catch (e: any) {
            return ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
}