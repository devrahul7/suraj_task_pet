import { Router } from "express";
import { ChatSessionController } from "../controllers/chat-session.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const controller = new ChatSessionController();

router.get("/sessions", authorizedMiddleware, controller.getSessions);
router.delete("/sessions/:sessionId", authorizedMiddleware, controller.deleteSession);

export default router;
