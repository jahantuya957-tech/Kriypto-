import axios from "axios";

const BASE_URL = process.env.BINANCE_BASE_URL || "https://api.binance.com";

/**
 * Get all trading symbols (USDT pairs filtered later)
 */
export const getAllSymbols = async () => {
  const res = await axios.get(`${BASE_URL}/api/v3/exchangeInfo`);

  return res.data.symbols
    .filter(s => s.status === "TRADING")
    .map(s => s.symbol);
};

/**
 * Get OHLCV data (candles)
 */
export const getCandles = async (symbol, interval = "15m", limit = 100) => {
  const res = await axios.get(`${BASE_URL}/api/v3/klines`, {
    params: { symbol, interval, limit }
  });

  return res.data.map(c => ({
    openTime: c[0],
    open: parseFloat(c[1]),
    high: parseFloat(c[2]),
    low: parseFloat(c[3]),
    close: parseFloat(c[4]),
    volume: parseFloat(c[5])
  }));
};
