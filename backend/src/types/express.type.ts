import { IUser } from "../models/user.model";

export interface IJwtPayload {
    id: string;
    email?: string;
    role: "USER" | "ADMIN";
    tokenVersion?: number;
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export {};