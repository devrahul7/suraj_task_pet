import {
  ActivityLog,
  IActivityLog,
  ActivityModule,
  ActivityAction,
} from "../models/activity-log.model";

export class ActivityLogRepository {
  async create(data: Partial<IActivityLog>): Promise<IActivityLog> {
    return await ActivityLog.create(data);
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: {
      module?: ActivityModule;
      action?: ActivityAction;
      actorId?: string;
    }
  ): Promise<{ logs: IActivityLog[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = {};
    if (filters?.module) query.module = filters.module;
    if (filters?.action) query.action = filters.action;
    if (filters?.actorId) query.actorId = filters.actorId;

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(query),
    ]);

    return { logs, total };
  }

  async getRecent(limit = 10): Promise<IActivityLog[]> {
    return await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async countByModule(): Promise<Record<string, number>> {
    const result = await ActivityLog.aggregate([
      { $group: { _id: "$module", count: { $sum: 1 } } },
    ]);
    return result.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);
  }

  async countByAction(): Promise<Record<string, number>> {
    const result = await ActivityLog.aggregate([
      { $group: { _id: "$action", count: { $sum: 1 } } },
    ]);
    return result.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);
  }

  async getDailyActivity(days = 30): Promise<{ date: string; count: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const result = await ActivityLog.aggregate([
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
