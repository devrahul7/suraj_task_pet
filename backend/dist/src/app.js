"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const upload_route_1 = __importDefault(require("./routes/upload.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const user_route_2 = __importDefault(require("./routes/admin/user.route"));
const blog_route_1 = __importDefault(require("./routes/admin/blog.route"));
const pet_route_1 = __importDefault(require("./routes/admin/pet.route"));
const pet_route_2 = __importDefault(require("./routes/pet.route"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const adoption_routes_1 = __importDefault(require("./routes/adoption.routes"));
const veterinarian_route_1 = __importDefault(require("./routes/admin/veterinarian.route"));
const vet_appointment_route_1 = __importDefault(require("./routes/admin/vet-appointment.route"));
const blog_route_2 = __importDefault(require("./routes/blog.route"));
const veterinarian_route_2 = __importDefault(require("./routes/veterinarian.route"));
const vet_appointment_route_2 = __importDefault(require("./routes/vet-appointment.route"));
const environment_1 = require("./config/environment");
const error_middleware_1 = require("./middlewares/error.middleware");
// ─── New admin management routes ───────────────────────────
const dashboard_route_1 = __importDefault(require("./routes/admin/dashboard.route"));
const user_management_route_1 = __importDefault(require("./routes/admin/user-management.route"));
const adoption_route_1 = __importDefault(require("./routes/admin/adoption.route"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const chat_session_routes_1 = __importDefault(require("./routes/chat-session.routes"));
const payment_route_1 = __importDefault(require("./routes/payment.route"));
const app = (0, express_1.default)();
let coresOptions = {
    origin: environment_1.config.allowedOrigins,
    optionsSuccessStatus: 200,
    credentials: true
};
app.use((0, cors_1.default)(coresOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads'))); // Serve static files from uploads directory
app.use("/api/v1/file", upload_route_1.default);
app.use("/api/v1/auth", user_route_1.default);
app.use("/api/v1/admin/users", user_route_2.default);
app.use("/api/v1/admin/blogs", blog_route_1.default);
app.use("/api/v1/admin/pets", pet_route_1.default);
app.use('/api/v1/admin/vets', veterinarian_route_1.default);
app.use('/api/v1/admin/appointments', vet_appointment_route_1.default);
// ─── New admin management endpoints ────────────────────────
app.use('/api/v1/admin/dashboard', dashboard_route_1.default);
app.use('/api/v1/admin/users-management', user_management_route_1.default);
app.use('/api/v1/admin/adoptions', adoption_route_1.default);
app.use('/api/v1/pets', pet_route_2.default);
app.use('/api/v1/ai', ai_routes_1.default);
app.use('/api/v1/ai', chat_session_routes_1.default);
app.use('/api/v1/blogs', blog_route_2.default);
app.use('/api/v1/adoptions', adoption_routes_1.default);
app.use('/api/v1/notifications', notification_routes_1.default);
app.use('/api/v1/payments', payment_route_1.default);
app.use('/api/v1/vet', veterinarian_route_2.default);
app.use('/api/v1/appointments', vet_appointment_route_2.default);
app.use(error_middleware_1.errorMiddleware);
exports.default = app;
