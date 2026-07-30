"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const constant_1 = require("./src/config/constant");
const mongodb_1 = require("./src/database/mongodb");
const auto_seed_1 = require("./src/utils/auto-seed");
(0, mongodb_1.connectToMongoDB)()
    .then(async () => {
    console.log("MongoDB connection established, starting server...");
    await (0, auto_seed_1.autoSeedAdmin)();
})
    .catch((error) => {
    console.error("Failed to connect to MongoDB, server not started.", error);
    process.exit(1); // Exit the process with an error code
});
// if same name imported use alias "as"
app_1.default.listen(constant_1.PORT, () => {
    console.log(`Server running: ${constant_1.PORT}`);
});
