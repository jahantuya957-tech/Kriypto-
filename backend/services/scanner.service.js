import { getAllSymbols, getCandles } from "./binance.service.js";
import { runStrategy } from "../strategies/rsi_macd_sr.strategy.js";

/**
 * Main scanner loop
 */
export const runScanner = async () => {
  try {
    const symbols = await getAllSymbols();

    // শুধু USDT pair রাখি
    const usdtPairs = symbols.filter(s => s.endsWith("USDT")).slice(0, 200);

    const results = [];

    for (const symbol of usdtPairs) {
      const candles = await getCandles(symbol, "15m", 100);

      const signal = await runStrategy(symbol, candles);

      if (signal && signal.score >= 70) {
        results.push(signal);
      }
    }

    return results;
  } catch (err) {
    console.error("Scanner Error:", err.message);
    return [];
  }
};
