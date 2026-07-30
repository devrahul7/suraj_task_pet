"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSessionController = void 0;
const ai_service_1 = require("../services/ai.service");
const api_response_1 = require("../utils/api-response");
const http_exception_1 = require("../exceptions/http-exception");
const aiService = new ai_service_1.AIService();
class ChatSessionController {
    /**
     * GET /api/v1/ai/sessions
     * List all chat sessions for the logged-in user
     */
    async getSessions(req, res) {
        try {
            const sessions = await aiService.getChatSessions(req.user.id);
            return api_response_1.ApiResponseHelper.success(res, sessions, 200, "Chat sessions retrieved successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
    /**
     * DELETE /api/v1/ai/sessions/:sessionId
     * Delete a chat session and all its messages
     */
    async deleteSession(req, res) {
        try {
            const { sessionId } = req.params;
            if (!sessionId) {
                throw new http_exception_1.HttpException(400, "Session ID is required");
            }
            await aiService.deleteChatSession(req.user.id, sessionId);
            return api_response_1.ApiResponseHelper.success(res, null, 200, "Chat session deleted successfully");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
}
exports.ChatSessionController = ChatSessionController;
