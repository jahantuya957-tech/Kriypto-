import { db } from "../config/db.js";

/**
 * Save signal to database
 */
export const saveSignal = async (signal) => {
  const query = `
    INSERT INTO signals 
    (symbol, timeframe, strategy, signal, entry_price, stop_loss, take_profit, score, grade, status, entry_time)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
  `;

  const values = [
    signal.symbol,
    signal.timeframe,
    signal.strategy,
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
  return result.rows[0];
};
