import { Router } from "express";
import { AdminDashboardController } from "../../controllers/admin/dashboard.controller";
import {
  authorizedMiddleware,
  isAdmin,
} from "../../middlewares/auth.middleware";

const router = Router();
const controller = new AdminDashboardController();

router.use(authorizedMiddleware, isAdmin);

router.get("/", controller.getFullDashboard);
router.get("/overview", controller.getOverview);
router.get("/monthly-reports", controller.getMonthlyReports);
router.get("/recent-activities", controller.getRecentActivities);
router.get("/activity-logs", controller.getActivityLogs);
router.get("/activity-stats", controller.getActivityStats);
router.get("/adoption-trends", controller.getAdoptionTrends);

export default router;
