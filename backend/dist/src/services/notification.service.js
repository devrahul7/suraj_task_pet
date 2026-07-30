"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_repository_1 = require("../repositories/notification.repository");
const http_exception_1 = require("../exceptions/http-exception");
class NotificationService {
    notificationRepository = new notification_repository_1.NotificationRepository();
    async createNotification(userId, type, title, message, link, metadata) {
        return this.notificationRepository.create({
            userId,
            type,
            title,
            message,
            link,
            metadata,
        });
    }
    async getNotifications(userId, page = 1, limit = 10, unreadOnly = false) {
        return this.notificationRepository.findByUserId(userId, page, limit, unreadOnly);
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.notificationRepository.findById(notificationId);
        if (!notification) {
            throw new http_exception_1.HttpException(404, "Notification not found");
        }
        if (notification.userId.toString() !== userId) {
            throw new http_exception_1.HttpException(403, "Unauthorized");
        }
        return this.notificationRepository.markAsRead(notificationId);
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.markAllAsRead(userId);
        return { message: "All notifications marked as read" };
    }
    async deleteNotification(notificationId, userId) {
        const deleted = await this.notificationRepository.delete(notificationId, userId);
        if (!deleted) {
            throw new http_exception_1.HttpException(404, "Notification not found");
        }
        return { message: "Notification deleted" };
    }
    async deleteAllRead(userId) {
        const count = await this.notificationRepository.deleteAllRead(userId);
        return { message: `${count} read notifications deleted`, count };
    }
    async getUnreadCount(userId) {
        const count = await this.notificationRepository.countUnread(userId);
        return { unreadCount: count };
    }
}
exports.NotificationService = NotificationService;
