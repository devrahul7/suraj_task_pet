"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VetAppointmentRepository = void 0;
const vet_appointment_model_1 = require("../models/vet-appointment.model");
class VetAppointmentRepository {
    async create(data) {
        return vet_appointment_model_1.VetAppointment.create(data);
    }
    async findById(id) {
        return vet_appointment_model_1.VetAppointment.findById(id)
            .populate("userId", "name email phone profileImage")
            .populate("veterinarianId", "name email phone specializations location profileImage rating")
            .populate("petId", "name species breed age images");
    }
    async findByUserId(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [appointments, total] = await Promise.all([
            vet_appointment_model_1.VetAppointment.find({ userId })
                .populate("veterinarianId", "name email phone specializations location profileImage rating")
                .populate("petId", "name species breed age images")
                .sort({
                appointmentDate: -1,
            })
                .skip(skip)
                .limit(limit),
            vet_appointment_model_1.VetAppointment.countDocuments({
                userId,
            }),
        ]);
        return {
            appointments,
            total,
        };
    }
    async findAll({ page = 1, limit = 10, status, veterinarianId, }) {
        const query = {};
        if (status) {
            query.status = status;
        }
        if (veterinarianId) {
            query.veterinarianId =
                veterinarianId;
        }
        const skip = (page - 1) * limit;
        const [appointments, total] = await Promise.all([
            vet_appointment_model_1.VetAppointment.find(query)
                .populate("userId", "name email phone profileImage")
                .populate("veterinarianId", "name email phone specializations location profileImage rating")
                .populate("petId", "name species breed age images")
                .sort({
                appointmentDate: -1,
            })
                .skip(skip)
                .limit(limit),
            vet_appointment_model_1.VetAppointment.countDocuments(query),
        ]);
        return {
            appointments,
            total,
        };
    }
    async update(id, data) {
        return vet_appointment_model_1.VetAppointment.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        })
            .populate("userId", "name email phone profileImage")
            .populate("veterinarianId", "name email phone specializations location profileImage rating")
            .populate("petId", "name species breed age images");
    }
    async delete(id) {
        return vet_appointment_model_1.VetAppointment.findByIdAndDelete(id);
    }
    async countByStatus() {
        const result = await vet_appointment_model_1.VetAppointment.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);
        return result.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});
    }
    async isSlotTaken(veterinarianId, appointmentDate, timeSlot) {
        const startOfDay = new Date(appointmentDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(appointmentDate);
        endOfDay.setHours(23, 59, 59, 999);
        const appointment = await vet_appointment_model_1.VetAppointment.exists({
            veterinarianId,
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay,
            },
            timeSlot,
            status: {
                $in: [
                    "PENDING",
                    "CONFIRMED",
                ],
            },
        });
        return !!appointment;
    }
    async getRecentAppointments(limit = 10) {
        return vet_appointment_model_1.VetAppointment.find()
            .populate("userId", "name email profileImage")
            .populate("veterinarianId", "name specializations")
            .sort({
            createdAt: -1,
        })
            .limit(limit);
    }
}
exports.VetAppointmentRepository = VetAppointmentRepository;
