/**
 * RSI (Relative Strength Index) - 14 period
 * Works on closing prices array
 */

export const calculateRSI = (candles, period = 14) => {
  if (!candles || candles.length < period + 1) {
    return null;
  }

  const closes = candles.map(c => c.close);

  let gains = 0;
  let losses = 0;

  // Initial average
  for (let i = 1; i <= period; i++) {
    const diff = closes[i] - closes[i - 1];

    if (diff >= 0) gains += diff;
    else losses += Math.abs(diff);
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  // Smooth RSI (Wilder method)
  for (let i = period + 1; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];

    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? Math.abs(diff) : 0;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }

  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  // STATE ANALYSIS
  let state = "neutral";
  if (rsi < 30) state = "oversold";
  else if (rsi > 70) state = "overbought";

  // MOMENTUM
  const prevRsi = calculateSimpleRSI(candles.slice(0, -1), period);

  let momentum = "neutral";
  if (prevRsi !== null) {
    if (rsi > prevRsi) momentum = "rising";
    else if (rsi < prevRsi) momentum = "falling";
  }

  return {
    rsiValue: parseFloat(rsi.toFixed(2)),
    state,
    momentum
  };
};

/**
 * Simple RSI for momentum comparison
 */
const calculateSimpleRSI = (candles, period) => {
  if (candles.length < period + 1) return null;

  const closes = candles.map(c => c.close);

  let gain = 0;
  let loss = 0;

  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gain += diff;
    else loss += Math.abs(diff);
  }

  const rs = loss === 0 ? 100 : gain / loss;
  return 100 - (100 / (1 + rs));
};
