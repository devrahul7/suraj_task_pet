"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogRepository = void 0;
const activity_log_model_1 = require("../models/activity-log.model");
class ActivityLogRepository {
    async create(data) {
        return await activity_log_model_1.ActivityLog.create(data);
    }
    async findAll(page = 1, limit = 10, filters) {
        const skip = (page - 1) * limit;
        const query = {};
        if (filters?.module)
            query.module = filters.module;
        if (filters?.action)
            query.action = filters.action;
        if (filters?.actorId)
            query.actorId = filters.actorId;
        const [logs, total] = await Promise.all([
            activity_log_model_1.ActivityLog.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            activity_log_model_1.ActivityLog.countDocuments(query),
        ]);
        return { logs, total };
    }
    async getRecent(limit = 10) {
        return await activity_log_model_1.ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(limit);
    }
    async countByModule() {
        const result = await activity_log_model_1.ActivityLog.aggregate([
            { $group: { _id: "$module", count: { $sum: 1 } } },
        ]);
        return result.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});
    }
    async countByAction() {
        const result = await activity_log_model_1.ActivityLog.aggregate([
            { $group: { _id: "$action", count: { $sum: 1 } } },
        ]);
        return result.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});
    }
    async getDailyActivity(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const result = await activity_log_model_1.ActivityLog.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return result.map((item) => ({ date: item._id, count: item.count }));
    }
}
exports.ActivityLogRepository = ActivityLogRepository;
