"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const ormconfig_1 = require("../ormconfig");
const user_router_1 = __importDefault(require("./routes/user.router"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const event_router_1 = __importDefault(require("./routes/event.router"));
const location_router_1 = __importDefault(require("./routes/location.router"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.get("/kishan", (req, res) => {
    res.send("Hello World! kishan");
});
// Routes
app.use("/auth", auth_router_1.default);
app.use("/user", user_router_1.default);
app.use("/events", event_router_1.default);
app.use("/location", location_router_1.default);
// Initialize Database & Start Server
ormconfig_1.AppDataSource.initialize()
    .then(() => {
    console.log("✅ Connected to PostgreSQL Database");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
})
    .catch((err) => console.error("❌ DB Connection Error:", err));
