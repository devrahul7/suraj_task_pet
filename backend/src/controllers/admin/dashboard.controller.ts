import { Request, Response } from "express";
import { AdminDashboardService } from "../../services/admin-dashboard.service";
import { ActivityLogService } from "../../services/activity-log.service";
import { ApiResponseHelper } from "../../utils/api-response";

const dashboardService = new AdminDashboardService();
const activityLogService = new ActivityLogService();

export class AdminDashboardController {
  async getOverview(req: Request, res: Response) {
    try {
      const stats = await dashboardService.getOverviewStatistics();
      return ApiResponseHelper.success(
        res,
        stats,
        200,
        "Dashboard overview retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async getMonthlyReports(req: Request, res: Response) {
    try {
      const months = Number(req.query.months) || 6;
      const reports = await dashboardService.getMonthlyReports(months);
      return ApiResponseHelper.success(
        res,
        reports,
        200,
        "Monthly reports retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async getRecentActivities(req: Request, res: Response) {
    try {
      const limit = Number(req.query.limit) || 10;
      const activities = await dashboardService.getRecentActivities(limit);
      return ApiResponseHelper.success(
        res,
        activities,
        200,
        "Recent activities retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async getActivityLogs(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const module = req.query.module as any;
      const action = req.query.action as any;
      const actorId = req.query.actorId as string;

      const result = await activityLogService.getActivities(page, limit, {
        module,
        action,
        actorId,
      });

      return ApiResponseHelper.success(
        res,
        result.logs,
        200,
        "Activity logs retrieved successfully",
        { page, limit, total: result.total }
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async getActivityStats(req: Request, res: Response) {
    try {
      const stats = await activityLogService.getActivityStats();
      return ApiResponseHelper.success(
        res,
        stats,
        200,
        "Activity statistics retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async getAdoptionTrends(req: Request, res: Response) {
    try {
      const trends = await dashboardService.getAdoptionTrends();
      return ApiResponseHelper.success(
        res,
        trends,
        200,
        "Adoption trends retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  async getFullDashboard(req: Request, res: Response) {
    try {
      const dashboard = await dashboardService.getFullDashboard();
      return ApiResponseHelper.success(
        res,
        dashboard,
        200,
        "Full dashboard data retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }
}
