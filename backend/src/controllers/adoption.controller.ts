import { Request, Response } from "express";

import { AdoptionService } from "../services/adoption.service";
import { ApiResponseHelper } from "../utils/api-response";
import { HttpException } from "../exceptions/http-exception";

const adoptionService = new AdoptionService();

export class AdoptionController {

    /**
     * USER
     * Submit Adoption Application
     */
    async submitApplication(
        req: Request,
        res: Response
    ) {
        try {
            const application =
                await adoptionService.submitApplication(
                    req.user!.id,
                    req.body
                );

            return ApiResponseHelper.success(
                res,
                application,
                201,
                "Application submitted successfully."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    /**
     * USER
     * My Applications
     */
    async getMyApplications(
        req: Request,
        res: Response
    ) {
        try {

            const page =
                Number(req.query.page) || 1;

            const limit =
                Number(req.query.limit) || 10;

            const result =
                await adoptionService.getMyApplications(
                    req.user!.id,
                    page,
                    limit
                );

            return ApiResponseHelper.success(
                res,
                result,
                200,
                "Applications retrieved successfully."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    /**
     * USER
     * Get Application
     */
    async getApplicationById(
        req: Request,
        res: Response
    ) {
        try {

            const application =
                await adoptionService.getApplicationById(
                    req.params.id
                );

            const isOwner =
                application.userId.toString() === req.user!.id;
            const isAdmin = req.user!.role === "ADMIN";

            if (!isOwner && !isAdmin) {
                return ApiResponseHelper.error(
                    res,
                    "Unauthorized.",
                    403
                );
            }

            return ApiResponseHelper.success(
                res,
                application,
                200,
                "Application retrieved successfully."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    /**
     * USER
     * Cancel Application
     */
    async cancelApplication(
        req: Request,
        res: Response
    ) {
        try {

            const application =
                await adoptionService.cancelApplication(
                    req.params.id,
                    req.user!.id
                );

            return ApiResponseHelper.success(
                res,
                application,
                200,
                "Application cancelled successfully."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    /**
     * ADMIN
     * Get All Applications
     */
    async getAllApplications(
        req: Request,
        res: Response
    ) {
        try {

            const page =
                Number(req.query.page) || 1;

            const limit =
                Number(req.query.limit) || 10;

            const status =
                req.query.status as string | undefined;

            const result =
                await adoptionService.getAllApplications(
                    page,
                    limit,
                    status
                );

            return ApiResponseHelper.success(
                res,
                result,
                200,
                "Applications retrieved successfully."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    /**
     * ADMIN
     * Pending Applications
     */
    async getPendingApplications(
        req: Request,
        res: Response
    ) {
        try {

            const applications =
                await adoptionService.getPendingApplications();

            return ApiResponseHelper.success(
                res,
                applications,
                200,
                "Pending applications retrieved."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    /**
     * ADMIN
     * Approve
     */
    async approveApplication(
        req: Request,
        res: Response
    ) {
        try {
            const application =
                await adoptionService.approveApplication(
                    req.params.id,
                    req.body.adminNotes
                );

            return ApiResponseHelper.success(
                res,
                application,
                200,
                "Application approved."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    /**
     * ADMIN
     * Reject
     */
    async rejectApplication(
        req: Request,
        res: Response
    ) {
        try {
            const application =
                await adoptionService.rejectApplication(
                    req.params.id,
                    req.body.adminNotes
                );

            return ApiResponseHelper.success(
                res,
                application,
                200,
                "Application rejected."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    /**
     * ADMIN
     * Complete Adoption
     */
    async completeAdoption(
        req: Request,
        res: Response
    ) {
        try {
            const application =
                await adoptionService.completeAdoption(
                    req.params.id
                );

            return ApiResponseHelper.success(
                res,
                application,
                200,
                "Adoption completed successfully."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    /**
     * Shared
     */
    async getApplicationsByPet(
        req: Request,
        res: Response
    ) {
        try {

            const applications =
                await adoptionService.getApplicationsByPet(
                    req.params.petId
                );

            return ApiResponseHelper.success(
                res,
                applications,
                200,
                "Applications retrieved successfully."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    /**
     * Shared
     */
    async getApplicationsByUser(
        req: Request,
        res: Response
    ) {
        try {

            const page =
                Number(req.query.page) || 1;

            const limit =
                Number(req.query.limit) || 10;

            const applications =
                await adoptionService.getApplicationsByUser(
                    req.params.userId,
                    page,
                    limit
                );

            return ApiResponseHelper.success(
                res,
                applications,
                200,
                "Applications retrieved successfully."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    /**
     * Dashboard Statistics
     */
    async getStatistics(
        req: Request,
        res: Response
    ) {
        try {

            const stats =
                await adoptionService.getStatistics();

            return ApiResponseHelper.success(
                res,
                stats,
                200,
                "Statistics retrieved successfully."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

    //findUserApplicationFOrPet
    async findUserApplicationForPet(
        req: Request,
        res: Response
    ) {

        try {

            const application =
                await adoptionService.findUserApplicationForPet(
                    req.user!.id,
                    req.params.petId
                );

            return ApiResponseHelper.success(
                res,
                application,
                200,
                "Application retrieved successfully."
            );

        } catch (e: any) {

            return ApiResponseHelper.error(
                res,
                e.message,
                e.status || 500
            );

        }
    }

}