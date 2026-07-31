import 'reflect-metadata';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import uploadRoute from './routes/upload.route';
import userRoute from './routes/user.route';
import adminUserRoute from './routes/admin/user.route';
import adminPetRoute from './routes/admin/pet.route';
import petRouter from './routes/pet.route';
import aiRouter from './routes/ai.routes';
import adoptionRouter from './routes/adoption.routes';
import { config } from './config/environment';
import { errorMiddleware } from './middlewares/error.middleware';

// ─── Admin management routes ───────────────────────────
import adminDashboardRoute from './routes/admin/dashboard.route';
import adminUserManagementRoute from './routes/admin/user-management.route';
import adminAdoptionRoute from './routes/admin/adoption.route';
import notificationRoute from './routes/notification.routes';
import chatSessionRoute from './routes/chat-session.routes';
import paymentRoute from './routes/payment.route';

const app: Application = express();
let coresOptions = {
    origin: config.allowedOrigins,
    optionsSuccessStatus: 200,
    credentials: true
}

app.use(cors(coresOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Serve static files from uploads directory
app.use("/api/v1/file", uploadRoute);
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/admin/users", adminUserRoute);
app.use("/api/v1/admin/pets", adminPetRoute);

// ─── Admin management endpoints ────────────────────────
app.use('/api/v1/admin/dashboard', adminDashboardRoute);
app.use('/api/v1/admin/users-management', adminUserManagementRoute);
app.use('/api/v1/admin/adoptions', adminAdoptionRoute);

app.use('/api/v1/pets', petRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/ai', chatSessionRoute);
app.use('/api/v1/adoptions', adoptionRouter);
app.use('/api/v1/notifications', notificationRoute);
app.use('/api/v1/payments', paymentRoute);

app.use(errorMiddleware);
export default app;
