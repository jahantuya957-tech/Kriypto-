import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

/**
 * GET ALL SIGNALS (for frontend dashboard)
 */
router.get("/", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM signals ORDER BY created_at DESC LIMIT 50"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

export default router;
