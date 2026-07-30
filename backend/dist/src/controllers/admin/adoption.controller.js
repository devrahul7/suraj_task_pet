"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAdoptionController = void 0;
const adoption_service_1 = require("../../services/adoption.service");
const api_response_1 = require("../../utils/api-response");
const adoption_model_1 = require("../../models/adoption.model");
const adoptionService = new adoption_service_1.AdoptionService();
class AdminAdoptionController {
    async bulkReject(req, res) {
        try {
            const { applicationIds, adminNotes } = req.body;
            if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
                return api_response_1.ApiResponseHelper.error(res, "Application IDs array is required", 400);
            }
            const results = await Promise.all(applicationIds.map((id) => adoptionService
                .rejectApplication(id, adminNotes || "Bulk rejected by admin")
                .then((app) => ({ id, success: true, status: app.status }))
                .catch((err) => ({
                id,
                success: false,
                error: err.message,
            }))));
            return api_response_1.ApiResponseHelper.success(res, results, 200, "Bulk rejection processed");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async bulkApprove(req, res) {
        try {
            const { applicationIds, adminNotes } = req.body;
            if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
                return api_response_1.ApiResponseHelper.error(res, "Application IDs array is required", 400);
            }
            const results = await Promise.all(applicationIds.map((id) => adoptionService
                .approveApplication(id, adminNotes)
                .then((app) => ({ id, success: true, status: app.status }))
                .catch((err) => ({
                id,
                success: false,
                error: err.message,
            }))));
            return api_response_1.ApiResponseHelper.success(res, results, 200, "Bulk approval processed");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async getApplicationsByStatus(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const status = req.params.status;
            const result = await adoptionService.getAllApplications(page, limit, status);
            return api_response_1.ApiResponseHelper.success(res, result.adoptions, 200, "Applications retrieved successfully", { page, limit, total: result.total });
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async getAdoptionStats(req, res) {
        try {
            const stats = await adoptionService.getDashboardStatistics();
            return api_response_1.ApiResponseHelper.success(res, stats, 200, "Adoption statistics retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async exportAdoptionData(req, res) {
        try {
            const status = req.query.status;
            const query = status ? { status } : {};
            const adoptions = await adoption_model_1.Adoption.find(query)
                .populate("userId", "fullName email phoneNumber")
                .populate("petId", "name species breed")
                .sort({ submittedAt: -1 })
                .limit(500);
            const csvHeader = "Application ID,User Name,User Email,Pet Name,Species,Breed,Status,AI Match Score,Submitted At,Reviewed At\n";
            const csvRows = adoptions.map((a) => {
                return [
                    a._id,
                    a.userId?.fullName || "",
                    a.userId?.email || "",
                    a.petId?.name || "",
                    a.petId?.species || "",
                    a.petId?.breed || "",
                    a.status,
                    a.aiMatchScore || "",
                    a.submittedAt?.toISOString() || "",
                    a.reviewedAt?.toISOString() || "",
                ].join(",");
            });
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", "attachment; filename=adoptions.csv");
            return res.send(csvHeader + csvRows.join("\n"));
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
}
exports.AdminAdoptionController = AdminAdoptionController;
