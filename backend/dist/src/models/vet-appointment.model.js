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
exports.VetAppointment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const vetAppointmentSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    veterinarianId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Veterinarian", required: true },
    petId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Pet", default: null },
    petName: { type: String, default: null },
    petSpecies: { type: String, default: null },
    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true, match: /^\d{2}:\d{2}$/ },
    reason: { type: String, required: true },
    ownerNotes: { type: String, default: null },
    adminNotes: { type: String, default: null },
    status: {
        type: String,
        enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
        default: "PENDING",
    },
    cancellationReason: { type: String, default: null },
}, { timestamps: true, versionKey: false });
vetAppointmentSchema.index({ veterinarianId: 1, appointmentDate: 1, timeSlot: 1 }, { unique: true });
vetAppointmentSchema.index({ userId: 1, status: 1 });
vetAppointmentSchema.index({ veterinarianId: 1, appointmentDate: 1 });
vetAppointmentSchema.index({ status: 1, createdAt: -1 });
exports.VetAppointment = mongoose_1.default.model("VetAppointment", vetAppointmentSchema);
