"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserRoleDto = void 0;
const zod_1 = require("zod");
exports.UpdateUserRoleDto = zod_1.z.object({
    role: zod_1.z.enum(["USER", "ADMIN"]),
});
