"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const notification_model_1 = require("../models/notification.model");
class NotificationRepository {
    async create(data) {
        return await notification_model_1.Notification.create(data);
    }
    async findByUserId(userId, page = 1, limit = 10, unreadOnly = false) {
        const skip = (page - 1) * limit;
        const query = { userId };
        if (unreadOnly)
            query.read = false;
        const [notifications, total, unreadCount] = await Promise.all([
            notification_model_1.Notification.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            notification_model_1.Notification.countDocuments(query),
            notification_model_1.Notification.countDocuments({ userId, read: false }),
        ]);
        return { notifications, total, unreadCount };
    }
    async findById(id) {
        return await notification_model_1.Notification.findById(id);
    }
    async markAsRead(id) {
        return await notification_model_1.Notification.findByIdAndUpdate(id, { read: true }, { new: true });
    }
    async markAllAsRead(userId) {
        await notification_model_1.Notification.updateMany({ userId, read: false }, { $set: { read: true } });
    }
    async delete(id, userId) {
        const result = await notification_model_1.Notification.deleteOne({ _id: id, userId });
        return result.deletedCount > 0;
    }
    async deleteAllRead(userId) {
        const result = await notification_model_1.Notification.deleteMany({ userId, read: true });
        return result.deletedCount;
    }
    async countUnread(userId) {
        return await notification_model_1.Notification.countDocuments({ userId, read: false });
    }
}
exports.NotificationRepository = NotificationRepository;
