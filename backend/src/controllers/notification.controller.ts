import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import { ApiResponseHelper } from "../utils/api-response";

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const unreadOnly = req.query.unread === "true";

      const result = await notificationService.getNotifications(
        req.user!.id,
        page,
        limit,
        unreadOnly
      );

      return ApiResponseHelper.success(
        res,
        result.notifications,
        200,
        "Notifications retrieved successfully",
        {
          page,
          limit,
          total: result.total,
          unreadCount: result.unreadCount,
        } as any
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async getUnreadCount(req: Request, res: Response) {
    try {
      const result = await notificationService.getUnreadCount(req.user!.id);
      return ApiResponseHelper.success(
        res,
        result,
        200,
        "Unread count retrieved"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async markAsRead(req: Request, res: Response) {
    try {
      const notification = await notificationService.markAsRead(
        req.params.id,
        req.user!.id
      );
      return ApiResponseHelper.success(
        res,
        notification,
        200,
        "Notification marked as read"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    try {
      const result = await notificationService.markAllAsRead(req.user!.id);
      return ApiResponseHelper.success(res, result, 200, result.message);
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async deleteNotification(req: Request, res: Response) {
    try {
      const result = await notificationService.deleteNotification(
        req.params.id,
        req.user!.id
      );
      return ApiResponseHelper.success(res, result, 200, result.message);
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async deleteAllRead(req: Request, res: Response) {
    try {
      const result = await notificationService.deleteAllRead(req.user!.id);
      return ApiResponseHelper.success(res, result, 200, result.message);
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }
}
