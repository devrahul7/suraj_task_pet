"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDashboardController = void 0;
const admin_dashboard_service_1 = require("../../services/admin-dashboard.service");
const activity_log_service_1 = require("../../services/activity-log.service");
const api_response_1 = require("../../utils/api-response");
const dashboardService = new admin_dashboard_service_1.AdminDashboardService();
const activityLogService = new activity_log_service_1.ActivityLogService();
class AdminDashboardController {
    async getOverview(req, res) {
        try {
            const stats = await dashboardService.getOverviewStatistics();
            return api_response_1.ApiResponseHelper.success(res, stats, 200, "Dashboard overview retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async getMonthlyReports(req, res) {
        try {
            const months = Number(req.query.months) || 6;
            const reports = await dashboardService.getMonthlyReports(months);
            return api_response_1.ApiResponseHelper.success(res, reports, 200, "Monthly reports retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async getRecentActivities(req, res) {
        try {
            const limit = Number(req.query.limit) || 10;
            const activities = await dashboardService.getRecentActivities(limit);
            return api_response_1.ApiResponseHelper.success(res, activities, 200, "Recent activities retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async getActivityLogs(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const module = req.query.module;
            const action = req.query.action;
            const actorId = req.query.actorId;
            const result = await activityLogService.getActivities(page, limit, {
                module,
                action,
                actorId,
            });
            return api_response_1.ApiResponseHelper.success(res, result.logs, 200, "Activity logs retrieved successfully", { page, limit, total: result.total });
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async getActivityStats(req, res) {
        try {
            const stats = await activityLogService.getActivityStats();
            return api_response_1.ApiResponseHelper.success(res, stats, 200, "Activity statistics retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async getAdoptionTrends(req, res) {
        try {
            const trends = await dashboardService.getAdoptionTrends();
            return api_response_1.ApiResponseHelper.success(res, trends, 200, "Adoption trends retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async getFullDashboard(req, res) {
        try {
            const dashboard = await dashboardService.getFullDashboard();
            return api_response_1.ApiResponseHelper.success(res, dashboard, 200, "Full dashboard data retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
}
exports.AdminDashboardController = AdminDashboardController;
