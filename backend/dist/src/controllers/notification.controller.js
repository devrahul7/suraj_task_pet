"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("../services/notification.service");
const api_response_1 = require("../utils/api-response");
const notificationService = new notification_service_1.NotificationService();
class NotificationController {
    async getNotifications(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const unreadOnly = req.query.unread === "true";
            const result = await notificationService.getNotifications(req.user.id, page, limit, unreadOnly);
            return api_response_1.ApiResponseHelper.success(res, result.notifications, 200, "Notifications retrieved successfully", {
                page,
                limit,
                total: result.total,
                unreadCount: result.unreadCount,
            });
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async getUnreadCount(req, res) {
        try {
            const result = await notificationService.getUnreadCount(req.user.id);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Unread count retrieved");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async markAsRead(req, res) {
        try {
            const notification = await notificationService.markAsRead(req.params.id, req.user.id);
            return api_response_1.ApiResponseHelper.success(res, notification, 200, "Notification marked as read");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async markAllAsRead(req, res) {
        try {
            const result = await notificationService.markAllAsRead(req.user.id);
            return api_response_1.ApiResponseHelper.success(res, result, 200, result.message);
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async deleteNotification(req, res) {
        try {
            const result = await notificationService.deleteNotification(req.params.id, req.user.id);
            return api_response_1.ApiResponseHelper.success(res, result, 200, result.message);
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    async deleteAllRead(req, res) {
        try {
            const result = await notificationService.deleteAllRead(req.user.id);
            return api_response_1.ApiResponseHelper.success(res, result, 200, result.message);
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
}
exports.NotificationController = NotificationController;
