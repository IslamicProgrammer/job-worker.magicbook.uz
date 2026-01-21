import express from "express";
import cors from "cors";
import { env } from "./lib/env.js";
import jobsRouter from "./routes/jobs.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/jobs", jobsRouter);

// Health check (public)
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "magicbook-job-worker",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    service: "MagicBook Job Worker",
    version: "1.0.0",
    endpoints: {
      health: "GET /health",
      characterReference: "POST /jobs/character-reference",
      illustration: "POST /jobs/illustration",
      batch: "POST /jobs/batch",
    },
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("[Error]", err);
  res.status(500).json({
    error: "Internal server error",
    message: env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
const PORT = parseInt(env.PORT, 10);

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║     MagicBook Job Worker                          ║
║     Running on port ${PORT}                           ║
║     Environment: ${env.NODE_ENV.padEnd(11)}                   ║
╚═══════════════════════════════════════════════════╝
  `);
});
