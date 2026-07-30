"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkApproveDto = exports.BulkRejectDto = void 0;
const zod_1 = require("zod");
exports.BulkRejectDto = zod_1.z.object({
    applicationIds: zod_1.z.array(zod_1.z.string().min(1)).min(1),
    adminNotes: zod_1.z.string().optional(),
});
exports.BulkApproveDto = zod_1.z.object({
    applicationIds: zod_1.z.array(zod_1.z.string().min(1)).min(1),
    adminNotes: zod_1.z.string().optional(),
});
