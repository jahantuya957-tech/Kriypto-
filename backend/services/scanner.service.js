import { getAllSymbols, getCandles } from "./binance.service.js";
import { runStrategy } from "../strategies/rsi_macd_sr.strategy.js";
import { saveSignal } from "./signal.service.js";
import { logger } from "../utils/logger.js";

export const runScanner = async () => {
  try {
    logger.info("Scanner started...");

    const symbols = await getAllSymbols();

    const usdtPairs = symbols
      .filter((s) => s.endsWith("USDT"))
      .slice(0, 200);

    const signals = [];

    for (const symbol of usdtPairs) {
      try {
        const candles = await getCandles(symbol, "15m", 100);

        const signal = await runStrategy(symbol, candles);

        if (signal && signal.score >= 70) {
          
          // 💾 SAVE TO DATABASE
          const saved = await saveSignal(signal);

          signals.push(saved || signal);

          logger.info("SIGNAL STORED", {
            symbol: signal.symbol,
            signal: signal.signal,
            score: signal.score,
            grade: signal.grade
          });
        }

      } catch (err) {
        logger.warn(`Error processing ${symbol}`, err.message);
      }
    }

    logger.info("Scanner finished", {
      totalSignals: signals.length
    });

    return signals;

  } catch (err) {
    logger.error("Scanner crashed", err.message);
    return [];
  }
};
