import {
    VetAppointment,
    IVetAppointment,
    AppointmentStatus,
} from "../models/vet-appointment.model";

export interface FindAppointmentOptions {
    page?: number;
    limit?: number;
    status?: AppointmentStatus;
    veterinarianId?: string;
}

export interface IVetAppointmentRepository {
    create(data: Partial<IVetAppointment>): Promise<IVetAppointment>;

    findById(id: string): Promise<IVetAppointment | null>;

    findByUserId(
        userId: string,
        page?: number,
        limit?: number
    ): Promise<{
        appointments: IVetAppointment[];
        total: number;
    }>;

    findAll(
        options: FindAppointmentOptions
    ): Promise<{
        appointments: IVetAppointment[];
        total: number;
    }>;

    update(
        id: string,
        data: Partial<IVetAppointment>
    ): Promise<IVetAppointment | null>;

    delete(id: string): Promise<IVetAppointment | null>;

    isSlotTaken(
        veterinarianId: string,
        appointmentDate: Date,
        timeSlot: string
    ): Promise<boolean>;

    countByStatus(): Promise<Record<string, number>>;

    getRecentAppointments(
        limit?: number
    ): Promise<IVetAppointment[]>;
}

export class VetAppointmentRepository
    implements IVetAppointmentRepository {
    async create(
        data: Partial<IVetAppointment>
    ): Promise<IVetAppointment> {
        return VetAppointment.create(data);
    }

    async findById(
        id: string
    ): Promise<IVetAppointment | null> {
        return VetAppointment.findById(id)
            .populate(
                "userId",
                "name email phone profileImage"
            )
            .populate(
                "veterinarianId",
                "name email phone specializations location profileImage rating"
            )
            .populate(
                "petId",
                "name species breed age images"
            );
    }

    async findByUserId(
        userId: string,
        page = 1,
        limit = 10
    ): Promise<{
        appointments: IVetAppointment[];
        total: number;
    }> {
        const skip = (page - 1) * limit;

        const [appointments, total] =
            await Promise.all([
                VetAppointment.find({ userId })
                    .populate(
                        "veterinarianId",
                        "name email phone specializations location profileImage rating"
                    )
                    .populate(
                        "petId",
                        "name species breed age images"
                    )
                    .sort({
                        appointmentDate: -1,
                    })
                    .skip(skip)
                    .limit(limit),

                VetAppointment.countDocuments({
                    userId,
                }),
            ]);

        return {
            appointments,
            total,
        };
    }

    async findAll({
        page = 1,
        limit = 10,
        status,
        veterinarianId,
    }: FindAppointmentOptions): Promise<{
        appointments: IVetAppointment[];
        total: number;
    }> {
        const query: Record<string, unknown> =
            {};

        if (status) {
            query.status = status;
        }

        if (veterinarianId) {
            query.veterinarianId =
                veterinarianId;
        }

        const skip = (page - 1) * limit;

        const [appointments, total] =
            await Promise.all([
                VetAppointment.find(query)
                    .populate(
                        "userId",
                        "name email phone profileImage"
                    )
                    .populate(
                        "veterinarianId",
                        "name email phone specializations location profileImage rating"
                    )
                    .populate(
                        "petId",
                        "name species breed age images"
                    )
                    .sort({
                        appointmentDate: -1,
                    })
                    .skip(skip)
                    .limit(limit),

                VetAppointment.countDocuments(
                    query
                ),
            ]);

        return {
            appointments,
            total,
        };
    }

    async update(
        id: string,
        data: Partial<IVetAppointment>
    ): Promise<IVetAppointment | null> {
        return VetAppointment.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true,
            }
        )
            .populate(
                "userId",
                "name email phone profileImage"
            )
            .populate(
                "veterinarianId",
                "name email phone specializations location profileImage rating"
            )
            .populate(
                "petId",
                "name species breed age images"
            );
    }

    async delete(
        id: string
    ): Promise<IVetAppointment | null> {
        return VetAppointment.findByIdAndDelete(
            id
        );
    }

    async countByStatus(): Promise<
        Record<string, number>
    > {
        const result =
            await VetAppointment.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: {
                            $sum: 1,
                        },
                    },
                },
            ]);

        return result.reduce(
            (
                acc: Record<string, number>,
                item
            ) => {
                acc[item._id] = item.count;
                return acc;
            },
            {}
        );
    }

    async isSlotTaken(
        veterinarianId: string,
        appointmentDate: Date,
        timeSlot: string
    ): Promise<boolean> {
        const startOfDay =
            new Date(appointmentDate);

        startOfDay.setHours(
            0,
            0,
            0,
            0
        );

        const endOfDay =
            new Date(appointmentDate);

        endOfDay.setHours(
            23,
            59,
            59,
            999
        );

        const appointment =
            await VetAppointment.exists({
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

    async getRecentAppointments(
        limit = 10
    ): Promise<IVetAppointment[]> {
        return VetAppointment.find()
            .populate(
                "userId",
                "name email profileImage"
            )
            .populate(
                "veterinarianId",
                "name specializations"
            )
            .sort({
                createdAt: -1,
            })
            .limit(limit);
    }
}