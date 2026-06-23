import { calculateRSI } from "../indicators/rsi.js";
import { calculateMACD } from "../indicators/macd.js";
import { calculateSupportResistance } from "../indicators/supportResistance.js";

/**
 * MAIN STRATEGY ENGINE
 * RSI + MACD + Support/Resistance Confluence
 */

export const runStrategy = async (symbol, candles) => {
  if (!candles || candles.length < 50) return null;

  const rsi = calculateRSI(candles);
  const macd = calculateMACD(candles);
  const sr = calculateSupportResistance(candles);

  if (!rsi || !macd || !sr) return null;

  const currentPrice = candles[candles.length - 1].close;

  let score = 0;
  let signal = null;

  // -------------------------
  // CONDITION 1: SUPPORT / RESISTANCE
  // -------------------------
  if (sr.priceLocation === "SUPPORT") score += 35;
  if (sr.priceLocation === "RESISTANCE") score += 35;

  // -------------------------
  // CONDITION 2: RSI
  // -------------------------
  let rsiBuy = rsi.state === "oversold" && rsi.momentum === "rising";
  let rsiSell = rsi.state === "overbought" && rsi.momentum === "falling";

  if (rsiBuy || rsiSell) score += 25;

  // -------------------------
  // CONDITION 3: MACD
  // -------------------------
  let macdBuy = macd.crossover === "bullish";
  let macdSell = macd.crossover === "bearish";

  if (macdBuy || macdSell) score += 25;

  // -------------------------
  // CONDITION 4: FINAL DIRECTION
  // -------------------------
  if (
    sr.priceLocation === "SUPPORT" &&
    rsiBuy &&
    macdBuy
  ) {
    signal = "BUY";
  }

  if (
    sr.priceLocation === "RESISTANCE" &&
    rsiSell &&
    macdSell
  ) {
    signal = "SELL";
  }

  // -------------------------
  // BREAKOUT / BREAKDOWN LOGIC
  // -------------------------
  if (sr.priceLocation === "RESISTANCE" && currentPrice > sr.resistancePrice) {
    signal = "BUY";
    score += 15;
  }

  if (sr.priceLocation === "SUPPORT" && currentPrice < sr.supportPrice) {
    signal = "SELL";
    score += 15;
  }

  // -------------------------
  // GRADE SYSTEM
  // -------------------------
  let grade = "IGNORE";

  if (score >= 90) grade = "A+";
  else if (score >= 80) grade = "A";
  else if (score >= 70) grade = "B";

  if (score < 70) return null;

  // -------------------------
  // FINAL OUTPUT
  // -------------------------
  return {
    symbol,
    strategy: "RSI_MACD_SR_CONFLUENCE",
    timeframe: "15m",

    priceLocation: sr.priceLocation,
    supportZone: sr.supportZone,
    resistanceZone: sr.resistanceZone,

    rsi: rsi.rsiValue,
    macdSignal: macd.crossover,

    breakout: false,
    retest: false,

    score,
    grade,
    signal,

    entryPrice: currentPrice,
    stopLoss: signal === "BUY"
      ? sr.supportPrice * 0.99
      : sr.resistancePrice * 1.01,

    takeProfit: signal === "BUY"
      ? currentPrice * 1.02
      : currentPrice * 0.98
  };
};
