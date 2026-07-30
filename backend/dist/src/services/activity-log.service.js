"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogService = void 0;
const activity_log_repository_1 = require("../repositories/activity-log.repository");
class ActivityLogService {
    activityLogRepository = new activity_log_repository_1.ActivityLogRepository();
    async logActivity(actorId, actorName, actorRole, module, action, description, entityId, entityType, metadata, ipAddress) {
        return this.activityLogRepository.create({
            actorId,
            actorName,
            actorRole,
            module,
            action,
            description,
            entityId,
            entityType,
            metadata,
            ipAddress,
        });
    }
    async getActivities(page = 1, limit = 10, filters) {
        return this.activityLogRepository.findAll(page, limit, filters);
    }
    async getRecentActivities(limit = 10) {
        return this.activityLogRepository.getRecent(limit);
    }
    async getActivityStats() {
        const [byModule, byAction, dailyActivity] = await Promise.all([
            this.activityLogRepository.countByModule(),
            this.activityLogRepository.countByAction(),
            this.activityLogRepository.getDailyActivity(30),
        ]);
        return { byModule, byAction, dailyActivity };
    }
}
exports.ActivityLogService = ActivityLogService;
