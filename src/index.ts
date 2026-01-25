import express from "express";
import cors from "cors";
import { env } from "./lib/env.js";
import jobsRouter from "./routes/jobs.js";
import { startWorker } from "./worker.js";

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
    version: "2.0.0",
    mode: "queue-based",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    service: "MagicBook Job Worker",
    version: "2.0.0",
    mode: "Database Queue Worker",
    description: "Polls PostgreSQL for pending jobs and processes one at a time",
    endpoints: {
      health: "GET /health",
      // Legacy endpoints still available for backwards compatibility
      characterReference: "POST /jobs/character-reference",
      illustration: "POST /jobs/illustration",
      batch: "POST /jobs/batch",
      pdf: "POST /jobs/pdf",
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
║     MagicBook Job Worker v2.0                     ║
║     Running on port ${PORT}                           ║
║     Environment: ${env.NODE_ENV.padEnd(11)}                   ║
║     Mode: Database Queue                          ║
╚═══════════════════════════════════════════════════╝
  `);

  // Start the queue worker
  startWorker().catch((error) => {
    console.error("[Worker] Fatal error:", error);
    process.exit(1);
  });
});
