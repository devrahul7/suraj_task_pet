import { Request, Response } from "express";
import { AIService } from "../services/ai.service";
import { ApiResponseHelper } from "../utils/api-response";
import { HttpException } from "../exceptions/http-exception";

const aiService = new AIService();

export class ChatSessionController {
  /**
   * GET /api/v1/ai/sessions
   * List all chat sessions for the logged-in user
   */
  async getSessions(req: Request, res: Response) {
    try {
      const sessions = await aiService.getChatSessions(req.user!.id);
      return ApiResponseHelper.success(
        res,
        sessions,
        200,
        "Chat sessions retrieved successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }

  /**
   * DELETE /api/v1/ai/sessions/:sessionId
   * Delete a chat session and all its messages
   */
  async deleteSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      if (!sessionId) {
        throw new HttpException(400, "Session ID is required");
      }
      await aiService.deleteChatSession(req.user!.id, sessionId);
      return ApiResponseHelper.success(
        res,
        null,
        200,
        "Chat session deleted successfully"
      );
    } catch (e: any) {
      return ApiResponseHelper.error(res, e.message, e.status || 500);
    }
  }
}
