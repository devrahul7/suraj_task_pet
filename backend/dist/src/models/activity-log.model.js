"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLog = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const activityLogSchema = new mongoose_1.Schema({
    actorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    actorName: {
        type: String,
        required: true,
    },
    actorRole: {
        type: String,
        enum: ["USER", "ADMIN"],
        required: true,
    },
    module: {
        type: String,
        enum: ["user", "pet", "adoption", "blog", "ai", "auth", "system"],
        required: true,
    },
    action: {
        type: String,
        enum: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "complete",
            "cancel",
            "suspend",
            "activate",
            "login",
            "register",
            "publish",
            "unpublish",
            "archive",
        ],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    entityId: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null,
    },
    entityType: {
        type: String,
        default: null,
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        default: null,
    },
    ipAddress: {
        type: String,
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});
activityLogSchema.index({ module: 1, action: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });
exports.ActivityLog = mongoose_1.default.model("ActivityLog", activityLogSchema);
