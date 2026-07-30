import { ChatMessage } from "../models/chat.model";

export class ChatRepository {

    async saveMessage(
        userId: string,
        sessionId: string,
        role: "user" | "assistant",
        content: string
    ) {
        return ChatMessage.create({
            userId,
            sessionId,
            role,
            content,
            timestamp: new Date(),
        });
    }

    async getConversation(
        userId: string,
        sessionId: string,
        limit = 20
    ) {
        return ChatMessage.find({
            userId,
            sessionId,
        })
            .sort({ timestamp: 1 })
            .limit(limit);
    }

    async getSessions(userId: string) {
        return ChatMessage.aggregate([
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

    async deleteSession(
        userId: string,
        sessionId: string
    ) {
        return ChatMessage.deleteMany({
            userId,
            sessionId,
        });
    }

    async getChatHistory(
        userId: string,
        sessionId: string,
        limit = 20
    ) {
        return this.getConversation(userId, sessionId, limit);
    }

    async getChatSessions(userId: string) {
        return this.getSessions(userId);

    }

}