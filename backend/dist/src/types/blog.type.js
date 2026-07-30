"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogSchema = void 0;
const zod_1 = require("zod");
exports.BlogSchema = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    authorId: zod_1.z.string(),
});
