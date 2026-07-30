import { Notification, INotification } from "../models/notification.model";

export class NotificationRepository {
  async create(data: Partial<INotification>): Promise<INotification> {
    return await Notification.create(data);
  }

  async findByUserId(
    userId: string,
    page = 1,
    limit = 10,
    unreadOnly = false
  ): Promise<{ notifications: INotification[]; total: number; unreadCount: number }> {
    const skip = (page - 1) * limit;
    const query: any = { userId };
    if (unreadOnly) query.read = false;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Notification.countDocuments(query),
      Notification.countDocuments({ userId, read: false }),
    ]);

    return { notifications, total, unreadCount };
  }

  async findById(id: string): Promise<INotification | null> {
    return await Notification.findById(id);
  }

  async markAsRead(id: string): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const result = await Notification.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  async deleteAllRead(userId: string): Promise<number> {
    const result = await Notification.deleteMany({ userId, read: true });
    return result.deletedCount;
  }

  async countUnread(userId: string): Promise<number> {
    return await Notification.countDocuments({ userId, read: false });
  }
}
