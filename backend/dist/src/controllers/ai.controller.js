"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const ai_service_1 = require("../services/ai.service");
const api_response_1 = require("../utils/api-response");
const http_exception_1 = require("../exceptions/http-exception");
const aiService = new ai_service_1.AIService();
class AIController {
    /**
     * Generate AI Pet Description
     * POST /api/v1/ai/generate-description
     */
    async generatePetDescription(req, res) {
        try {
            const description = await aiService.generatePetDescription(req.body);
            return api_response_1.ApiResponseHelper.success(res, {
                description,
            }, 200, "Pet description generated successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to generate description.", e.status || 500);
        }
    }
    /**
     * Match Pets for Logged-in User
     * GET /api/v1/ai/match
     *  */
    async matchPets(req, res) {
        try {
            const matches = await aiService.matchPetsForUser(req.user.id);
            return api_response_1.ApiResponseHelper.success(res, matches, 200, "Pet matches generated successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to match pets.", e.status || 500);
        }
    }
    /**
     * Analyze Compatibility
     * POST /api/v1/ai/analyze-compatibility
     */
    async analyzeCompatibility(req, res) {
        try {
            const result = await aiService.analyzeCompatibility(req.user.id, req.body.petId);
            return api_response_1.ApiResponseHelper.success(res, result, 200, "Compatibility analysis completed successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to analyze compatibility.", e.status || 500);
        }
    }
    /**
     * AI Chat (Streaming)
     * POST /api/v1/ai/chat
     */
    async chat(req, res) {
        try {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.setHeader("Transfer-Encoding", "chunked");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.flushHeaders();
            for await (const token of aiService.chatStream(req.user.id, req.body.sessionId, req.body.message)) {
                res.write(token);
            }
            res.end();
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to chat with AI.", e.status || 500);
        }
    }
    /**
     * Chat History
     * GET /api/v1/ai/chat-history
     */
    async getChatHistory(req, res) {
        try {
            const sessionId = req.query.sessionId;
            if (!sessionId) {
                throw new http_exception_1.HttpException(400, "Session ID is required.");
            }
            const history = await aiService.getChatHistory(req.user.id, sessionId);
            return api_response_1.ApiResponseHelper.success(res, history, 200, "Chat history retrieved successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message || "Failed to retrieve chat history.", e.status || 500);
        }
    }
    /**
     * Personalized Recommendations
     * GET /api/v1/ai/recommendations
     */
    async getRecommendations(req, res) {
        try {
            const recommendations = await aiService.getPersonalizedRecommendations(req.user.id);
            return api_response_1.ApiResponseHelper.success(res, recommendations, 200, "Recommendations generated successfully.");
        }
        catch (e) {
            return api_response_1.ApiResponseHelper.error(res, e.message, e.status || 500);
        }
    }
}
exports.AIController = AIController;
