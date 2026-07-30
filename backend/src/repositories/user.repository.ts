import User, { IUser } from "../models/user.model";
import { UserType } from "../types/user.type";

export interface IUserRepository {
    create(user: Partial<IUser>): Promise<IUser>;

    findById(id: string): Promise<IUser | null>;

    findByUsername(username: string): Promise<IUser | null>;

    findByEmail(email: string): Promise<IUser | null>;

    findByEmailWithPassword(email: string): Promise<IUser | null>;

    findByRefreshToken(token: string): Promise<IUser | null>;

    findByResetPasswordToken(token: string): Promise<IUser | null>;

    findByEmailVerificationToken(token: string): Promise<IUser | null>;

    findAll(
        page?: number,
        limit?: number
    ): Promise<{
        users: IUser[];
        total: number;
    }>;

    update(
        id: string,
        user: Partial<IUser>
    ): Promise<IUser | null>;

    delete(id: string): Promise<boolean>;

    countByRole(): Promise<Record<string, number>>;
}

export class UserRepository implements IUserRepository {

    async create(user: UserType): Promise<IUser> {
        return await User.create(user);
    }

    async findById(id: string): Promise<IUser | null> {
        return await User.findById(id).select("-password");
    }
    async findByIdWithPassword(
        id: string
    ): Promise<IUser | null> {
        return await User.findById(id).select("+password");
    }

    async findByUsername(username: string): Promise<IUser | null> {
        return await User.findOne({ username }).select("-password");
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email }).select("-password");
    }

    async findByEmailWithPassword(
        email: string
    ): Promise<IUser | null> {
        return await User.findOne({ email }).select("+password");
    }

    async findByRefreshToken(token: string): Promise<IUser | null> {
        return await User.findOne({
            refreshTokenHash: token,
            refreshTokenExpiresAt: { $gt: new Date() },
        }).select(
            "+refreshTokenHash +refreshTokenExpiresAt"
        );
    }

    async findByResetPasswordToken(token: string): Promise<IUser | null> {
        return await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: new Date() },
        }).select("+password +resetPasswordToken +resetPasswordExpiresAt");
    }

    async findByEmailVerificationToken(token: string): Promise<IUser | null> {
        return await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpiresAt: { $gt: new Date() },
        }).select("+emailVerificationToken +emailVerificationExpiresAt");
    }

    async findAll(
        page = 1,
        limit = 10
    ): Promise<{ users: IUser[]; total: number }> {

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            User.countDocuments(),
        ]);

        return { users, total };
    }

    async update(
        id: string,
        user: Partial<UserType>
    ): Promise<IUser | null> {

        return await User.findByIdAndUpdate(
            id,
            user,
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");
    }

    async delete(id: string): Promise<boolean> {

        const deleted = await User.findByIdAndDelete(id);

        return deleted !== null;
    }

    async countByRole(): Promise<Record<string, number>> {

        const result = await User.aggregate([
            {
                $group: {
                    _id: "$role",
                    count: {
                        $sum: 1,
                    },
                },
            },
        ]);

        return result.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {} as Record<string, number>);
    }
}