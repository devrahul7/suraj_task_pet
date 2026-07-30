import { Request, Response } from "express";

import { AIService } from "../services/ai.service";
import { ApiResponseHelper } from "../utils/api-response";
import { HttpException } from "../exceptions/http-exception";

const aiService = new AIService();

export class AIController {

  /**
   * Generate AI Pet Description
   * POST /api/v1/ai/generate-description
   */
  async generatePetDescription(
    req: Request,
    res: Response
  ) {
    try {
      const description =
        await aiService.generatePetDescription(req.body);

      return ApiResponseHelper.success(
        res,
        {
          description,
        },
        200,
        "Pet description generated successfully."
      );

    } catch (e: any) {

      return ApiResponseHelper.error(
        res,
        e.message || "Failed to generate description.",
        e.status || 500
      );

    }
  }
  /**
   * Match Pets for Logged-in User
   * GET /api/v1/ai/match   
   *  */
  async matchPets(req: Request, res: Response) {
    try {
      const matches = await aiService.matchPetsForUser(req.user!.id);
      return ApiResponseHelper.success(
        res,
        matches,
        200,
        "Pet matches generated successfully."
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to match pets.",
        e.status || 500
      );
    }
  }

  /**
   * Analyze Compatibility
   * POST /api/v1/ai/analyze-compatibility
   */
  async analyzeCompatibility(req: Request, res: Response) {
    try {
      const result = await aiService.analyzeCompatibility(req.user!.id, req.body.petId);
      return ApiResponseHelper.success(
        res,
        result,
        200,
        "Compatibility analysis completed successfully."
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to analyze compatibility.",
        e.status || 500
      );
    }
  }
  /**
   * AI Chat (Streaming)
   * POST /api/v1/ai/chat
   */
  async chat(req: Request, res: Response) {
    try {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Transfer-Encoding", "chunked");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();
      for await (const token of aiService.chatStream(req.user!.id, req.body.sessionId, req.body.message)) {
        res.write(token);
      }
      res.end();
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to chat with AI.",
        e.status || 500
      );
    }
  }
  /**
   * Chat History
   * GET /api/v1/ai/chat-history
   */
  async getChatHistory(req: Request, res: Response) {
    try {
      const sessionId = req.query.sessionId as string;
      if (!sessionId) {
        throw new HttpException(400, "Session ID is required.");
      }
      const history = await aiService.getChatHistory(req.user!.id, sessionId);
      return ApiResponseHelper.success(
        res,
        history,
        200,
        "Chat history retrieved successfully."
      );
    } catch (e: any) {
      return ApiResponseHelper.error(
        res,
        e.message || "Failed to retrieve chat history.",
        e.status || 500
      );
    }
  }

  /**
   * Personalized Recommendations
   * GET /api/v1/ai/recommendations
   */
  async getRecommendations(
    req: Request,
    res: Response
  ) {

    try {

      const recommendations =
        await aiService.getPersonalizedRecommendations(
          req.user!.id
        );

      return ApiResponseHelper.success(
        res,
        recommendations,
        200,
        "Recommendations generated successfully."
      );

    } catch (e: any) {

      return ApiResponseHelper.error(
        res,
        e.message,
        e.status || 500
      );

    }

  }
}