import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    project: "Kriypto Trading System",
    version: "1.0"
  });
});

export default app;
