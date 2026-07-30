"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const chat_model_1 = require("../models/chat.model");
class ChatRepository {
    async saveMessage(userId, sessionId, role, content) {
        return chat_model_1.ChatMessage.create({
            userId,
            sessionId,
            role,
            content,
            timestamp: new Date(),
        });
    }
    async getConversation(userId, sessionId, limit = 20) {
        return chat_model_1.ChatMessage.find({
            userId,
            sessionId,
        })
            .sort({ timestamp: 1 })
            .limit(limit);
    }
    async getSessions(userId) {
        return chat_model_1.ChatMessage.aggregate([
            {
                $match: {
                    userId,
                },
            },
            {
                $group: {
                    _id: "$sessionId",
                    lastMessage: {
                        $max: "$timestamp",
                    },
                },
            },
            {
                $sort: {
                    lastMessage: -1,
                },
            },
        ]);
    }
    async deleteSession(userId, sessionId) {
        return chat_model_1.ChatMessage.deleteMany({
            userId,
            sessionId,
        });
    }
    async getChatHistory(userId, sessionId, limit = 20) {
        return this.getConversation(userId, sessionId, limit);
    }
    async getChatSessions(userId) {
        return this.getSessions(userId);
    }
}
exports.ChatRepository = ChatRepository;
