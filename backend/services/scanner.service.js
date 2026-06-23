import { db } from "../config/db.js";
import { logger } from "../utils/logger.js";

/**
 * Save trading signal into database
 */

export const saveSignal = async (signal) => {
  try {
    const query = `
      INSERT INTO signals (
        symbol,
        timeframe,
        strategy,
        signal,
        entry_price,
        stop_loss,
        take_profit,
        score,
        grade,
        status,
        entry_time
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING *
    `;

    const values = [
      signal.symbol,
      signal.timeframe || "15m",
      signal.strategy || "RSI_MACD_SR_CONFLUENCE",
      signal.signal,
      signal.entryPrice,
      signal.stopLoss,
      signal.takeProfit,
      signal.score,
      signal.grade,
      "OPEN",
      new Date()
    ];

    const result = await db.query(query, values);

    logger.info("Signal saved", {
      symbol: signal.symbol,
      signal: signal.signal,
      score: signal.score
    });

    return result.rows[0];
  } catch (err) {
    logger.error("Failed to save signal", err.message);
    return null;
  }
};
