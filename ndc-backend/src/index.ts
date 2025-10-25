// ndc-backend\src\index.ts

import express from "express";
import cors from "cors";
import compression from "compression";
import path from "path";
import "dotenv/config";

import { connectDB } from "./db/connect";
import usersRouter from "./routes/users";
import officialsRouter from "./routes/officials";
import projectRouter from "./routes/projects";
import selfPlacementRoutes from "./routes/selfPlacement";

const app = express();

// -----------------------------
// Environment Configuration
// -----------------------------
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI is missing in environment config");
}

// -----------------------------
// Request Logger (for debugging)
// -----------------------------
app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// -----------------------------
// CORS Configuration
// -----------------------------
const allowedOrigins = [
  "http://localhost:5183", // ✅ NDC local dev frontend
  "http://localhost:4175", // ✅ NDC preview port
  "https://ndc-party-platform.vercel.app", // ✅ NDC production
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      // Allow exact allowed origins
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow Vercel preview URLs for NDC frontend
      if (/^https:\/\/ndc-party-platform(-[\w-]+)?\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      console.warn("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// -----------------------------
// Middleware Setup
// -----------------------------
app.use(compression());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use((req, res, next) => {
  if (req.is("multipart/form-data")) return next();
  express.json({ limit: "10mb" })(req, res, next);
});

app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

// -----------------------------
// Routes
// -----------------------------
app.use("/api/users", usersRouter);
app.use("/api/officials", officialsRouter);
app.use("/api/projects", projectRouter);
app.use("/api/self-placement", selfPlacementRoutes);

// -----------------------------
// Health Check Endpoint
// -----------------------------
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "ndc-backend",
    version: "1.0",
    time: new Date().toISOString(),
  });
});

// -----------------------------
// 404 Fallback
// -----------------------------
app.use("*", (_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// -----------------------------
// Global Error Handler
// -----------------------------
app.use(
  (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("❌ Unhandled Error:", err.message || err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

// -----------------------------
// Start Server
// -----------------------------
async function start() {
  try {
    await connectDB(MONGO_URI!);
    app.listen(PORT, () =>
      console.log(`✅ NDC Backend running on port ${PORT} with CORS enabled`)
    );
  } catch (err) {
    console.error("❌ Startup Error:", err);
    process.exit(1);
  }
}

start();
