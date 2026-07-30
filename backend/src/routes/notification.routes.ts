import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new NotificationController();

router.get("/", authorizedMiddleware, controller.getNotifications);
router.get("/unread-count", authorizedMiddleware, controller.getUnreadCount);
router.patch("/mark-all-read", authorizedMiddleware, controller.markAllAsRead);
router.delete("/read", authorizedMiddleware, controller.deleteAllRead);
router.patch("/:id/read", authorizedMiddleware, controller.markAsRead);
router.delete("/:id", authorizedMiddleware, controller.deleteNotification);

export default router;
