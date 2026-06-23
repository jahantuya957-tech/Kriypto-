/**
 * Simple production logger
 */

export const logger = {
  info: (msg, data = null) => {
    console.log(`[INFO] ${msg}`, data || "");
  },

  error: (msg, error = null) => {
    console.error(`[ERROR] ${msg}`, error || "");
  },

  warn: (msg, data = null) => {
    console.warn(`[WARN] ${msg}`, data || "");
  }
};
