"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const ai_dto_1 = require("../dtos/ai.dto");
const router = (0, express_1.Router)();
const aiController = new ai_controller_1.AIController();
/**
 * AI Pet Description
 * Admin Only
 */
router.post("/generate-description", auth_middleware_1.authorizedMiddleware, auth_middleware_1.isAdmin, (0, validation_middleware_1.validationMiddleware)(ai_dto_1.GeneratePetDescriptionDto), aiController.generatePetDescription);
// Match Pets for Logged-in User
router.get("/match", auth_middleware_1.authorizedMiddleware, aiController.matchPets);
// Analyze Compatibility
router.post("/analyze-compatibility", auth_middleware_1.authorizedMiddleware, (0, validation_middleware_1.validationMiddleware)(ai_dto_1.AnalyzeCompatibilityDto), aiController.analyzeCompatibility);
// Chat with AI
router.post("/chat", auth_middleware_1.authorizedMiddleware, (0, validation_middleware_1.validationMiddleware)(ai_dto_1.ChatRequestDto), aiController.chat);
// Get Chat History
router.get("/chat-history", auth_middleware_1.authorizedMiddleware, aiController.getChatHistory);
// Get Personalized Recommendations
router.get("/recommendations", auth_middleware_1.authorizedMiddleware, aiController.getRecommendations);
exports.default = router;
