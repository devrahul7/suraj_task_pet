"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchUsersDto = exports.SuspendUserDto = void 0;
const zod_1 = require("zod");
exports.SuspendUserDto = zod_1.z.object({
    reason: zod_1.z.string().min(3, "Suspension reason is required"),
});
exports.SearchUsersDto = zod_1.z.object({
    query: zod_1.z.string().min(1),
    role: zod_1.z.enum(["USER", "ADMIN"]).optional(),
    status: zod_1.z.enum(["active", "suspended"]).optional(),
});
