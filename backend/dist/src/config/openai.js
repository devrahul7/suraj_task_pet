"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = void 0;
const openai_1 = __importDefault(require("openai"));
const environment_1 = require("./environment");
exports.openai = new openai_1.default({
    apiKey: environment_1.config.openaiApiKey || "dummy_key_for_development",
});
