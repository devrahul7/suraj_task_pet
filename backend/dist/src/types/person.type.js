"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonSchema = void 0;
const zod_1 = require("zod");
exports.PersonSchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string().min(1, "Name is required"),
    age: zod_1.z.number().min(0, "Age must be a positive number")
});
