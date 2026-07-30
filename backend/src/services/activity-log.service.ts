import { ActivityLogRepository } from "../repositories/activity-log.repository";
import {
  ActivityModule,
  ActivityAction,
} from "../models/activity-log.model";

export class ActivityLogService {
  private activityLogRepository = new ActivityLogRepository();

  async logActivity(
    actorId: string,
    actorName: string,
    actorRole: string,
    module: ActivityModule,
    action: ActivityAction,
    description: string,
    entityId?: string,
    entityType?: string,
    metadata?: Record<string, any>,
    ipAddress?: string
  ) {
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

  async getActivities(
    page = 1,
    limit = 10,
    filters?: {
      module?: ActivityModule;
      action?: ActivityAction;
      actorId?: string;
    }
  ) {
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
