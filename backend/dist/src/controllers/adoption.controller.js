"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdoptionController = void 0;
const adoption_service_1 = require("../services/adoption.service");
const api_response_1 = require("../utils/api-response");
const adoptionService = new adoption_service_1.AdoptionService();
class AdoptionController {
    /**
     * USER
     * Submit Adoption Application
     */
    async submitApplication(req, res) {
        try {
            const application = await adoptionService.submitApplication(req.user.id, req.body);
            return api_response_1.ApiResponseHelper.success(res, application, 201, "Application submitted successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * USER
     * My Applications
     */
    async getMyApplications(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const result = await adoptionService.getMyApplications(req.user.id, page, limit);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Applications retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * USER
     * Get Application
     */
    async getApplicationById(req, res) {
        try {
            const application = await adoptionService.getApplicationById(req.params.id);
            const isOwner = application.userId.toString() === req.user.id;
            const isAdmin = req.user.role === "ADMIN";
            if (!isOwner && !isAdmin) {
                return api_response_1.ApiResponseHelper.error(res, "Unauthorized.", 403);
            }
            return api_response_1.ApiResponseHelper.success(res, application, 200, "Application retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * USER
     * Cancel Application
     */
    async cancelApplication(req, res) {
        try {
            const application = await adoptionService.cancelApplication(req.params.id, req.user.id);
            return api_response_1.ApiResponseHelper.success(res, application, 200, "Application cancelled successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * ADMIN
     * Get All Applications
     */
    async getAllApplications(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const status = req.query.status;
            const result = await adoptionService.getAllApplications(page, limit, status);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Applications retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * ADMIN
     * Pending Applications
     */
    async getPendingApplications(req, res) {
        try {
            const applications = await adoptionService.getPendingApplications();
            return api_response_1.ApiResponseHelper.success(res, applications, 200, "Pending applications retrieved.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * ADMIN
     * Approve
     */
    async approveApplication(req, res) {
        try {
            const application = await adoptionService.approveApplication(req.params.id, req.body.adminNotes);
            return api_response_1.ApiResponseHelper.success(res, application, 200, "Application approved.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * ADMIN
     * Reject
     */
    async rejectApplication(req, res) {
        try {
            const application = await adoptionService.rejectApplication(req.params.id, req.body.adminNotes);
            return api_response_1.ApiResponseHelper.success(res, application, 200, "Application rejected.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * ADMIN
     * Complete Adoption
     */
    async completeAdoption(req, res) {
        try {
            const application = await adoptionService.completeAdoption(req.params.id);
            return api_response_1.ApiResponseHelper.success(res, application, 200, "Adoption completed successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * Shared
     */
    async getApplicationsByPet(req, res) {
        try {
            const applications = await adoptionService.getApplicationsByPet(req.params.petId);
            return api_response_1.ApiResponseHelper.success(res, applications, 200, "Applications retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * Shared
     */
    async getApplicationsByUser(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const applications = await adoptionService.getApplicationsByUser(req.params.userId, page, limit);
            return api_response_1.ApiResponseHelper.success(res, applications, 200, "Applications retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * Dashboard Statistics
     */
    async getStatistics(req, res) {
        try {
            const stats = await adoptionService.getStatistics();
            return api_response_1.ApiResponseHelper.success(res, stats, 200, "Statistics retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    //findUserApplicationFOrPet
    async findUserApplicationForPet(req, res) {
        try {
            const application = await adoptionService.findUserApplicationForPet(req.user.id, req.params.petId);
            return api_response_1.ApiResponseHelper.success(res, application, 200, "Application retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
}
exports.AdoptionController = AdoptionController;
