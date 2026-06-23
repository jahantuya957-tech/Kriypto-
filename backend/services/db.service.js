import { db } from "../config/db.js";

/**
 * Generic query executor
 */
export const queryDB = async (query, params = []) => {
  try {
    const result = await db.query(query, params);
    return result.rows;
  } catch (err) {
    console.error("DB Error:", err.message);
    throw err;
  }
};
