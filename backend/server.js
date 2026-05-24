import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import assessmentRoutes from "./src/routes/assessment.routes.js";
import analysisRoutes from "./src/routes/analysis.routes.js";
import courseRoutes from "./src/routes/course.routes.js";
import studyRoutes from "./src/routes/study.routes.js";

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/study", studyRoutes);

app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

let httpServer = null;
let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`\n${signal} received, shutting down...`);

  if (httpServer) {
    httpServer.closeAllConnections?.();
    await new Promise((resolve) => httpServer.close(resolve));
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }

  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

async function start() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing. Create backend/.env from .env.example");
  }

  await mongoose.connect(MONGO_URI);
  console.log("MongoDB connected");

  await new Promise((resolve, reject) => {
    httpServer = app.listen(PORT, () => {
      console.log(`API running on http://localhost:${PORT}`);
      resolve();
    });

    httpServer.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Run "npm run dev" again (it frees the port automatically) or stop the other process.`
        );
        process.exit(1);
        return;
      }
      reject(err);
    });
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
