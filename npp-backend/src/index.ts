// npp-backend/src/index.ts

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
  "http://localhost:5173", // Local dev
  "https://ikesoft-party-platform.vercel.app", // Main production domain
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      // Allow localhost and main production domain
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow all future Vercel preview deployments
      if (/^https:\/\/ikesoft-party-platform(-[\w-]+)?\.vercel\.app$/.test(origin)) {
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
// Middleware Setup (optimized for uploads)
// -----------------------------

// ✅ Enable gzip compression
app.use(compression());

// ✅ Parse URL-encoded form data (non-file forms)
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Parse JSON, but skip for multipart/form-data (important for multer uploads)
app.use((req, res, next) => {
  if (req.is("multipart/form-data")) return next();
  express.json({ limit: "10mb" })(req, res, next);
});

// ✅ Serve static uploads (for backward compatibility / Cloudinary fallback)
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
    service: "npp-backend",
    version: "0.1",
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
      console.log(`✅ Backend running on port ${PORT} and CORS enabled`)
    );
  } catch (err) {
    console.error("❌ Startup Error:", err);
    process.exit(1);
  }
}

start();
