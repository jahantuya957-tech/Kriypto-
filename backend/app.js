import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";
import signalsRoutes from "./routes/signals.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// =======================
// ROUTES
// =======================

app.use("/api/health", healthRoutes);

// 🔥 NEW: Signals API (Frontend Dashboard)
app.use("/api/signals", signalsRoutes);

// =======================
// BASE ROUTE
// =======================

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    project: "Kriypto Trading System",
    version: "1.0",
    endpoints: {
      health: "/api/health",
      signals: "/api/signals"
    }
  });
});

export default app;
