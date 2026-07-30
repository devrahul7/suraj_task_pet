import { Router } from "express";
import { AIController } from "../controllers/ai.controller";
import {
    authorizedMiddleware,
    isAdmin,
} from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import {
    AnalyzeCompatibilityDto,
    ChatRequestDto,
    GeneratePetDescriptionDto,
} from "../dtos/ai.dto";

const router = Router();
const aiController = new AIController();

/**
 * AI Pet Description
 * Admin Only
 */
router.post(
    "/generate-description",
    authorizedMiddleware,
    isAdmin,
    validationMiddleware(GeneratePetDescriptionDto),
    aiController.generatePetDescription
);

// Match Pets for Logged-in User
router.get(
    "/match",
    authorizedMiddleware,
    aiController.matchPets
);

// Analyze Compatibility
router.post(
    "/analyze-compatibility",
    authorizedMiddleware,
    validationMiddleware(AnalyzeCompatibilityDto),
    aiController.analyzeCompatibility
);
// Chat with AI
router.post(
    "/chat",
    authorizedMiddleware,
    validationMiddleware(ChatRequestDto),
    aiController.chat
);
// Get Chat History
router.get(
    "/chat-history",
    authorizedMiddleware,
    aiController.getChatHistory
);
// Get Personalized Recommendations
router.get(
    "/recommendations",
    authorizedMiddleware,
    aiController.getRecommendations
);

export default router;