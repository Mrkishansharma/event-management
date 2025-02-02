import "reflect-metadata";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { AppDataSource } from "../ormconfig";
import userRoutes from "./routes/user.router";
import authRoutes from "./routes/auth.router";
import eventRoutes from "./routes/event.router"
import locationRoutes from "./routes/location.router"

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
})

app.get("/kishan", (req, res) => {
  res.send("Hello World! kishan");
})

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/events", eventRoutes)
app.use("/location", locationRoutes)

// Initialize Database & Start Server
AppDataSource.initialize()
  .then(() => {

    console.log("✅ Connected to PostgreSQL Database");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err: any) => console.error("❌ DB Connection Error:", err));
