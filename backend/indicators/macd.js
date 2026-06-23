/**
 * MACD (12, 26, 9)
 * Returns crossover + histogram trend
 */

export const calculateMACD = (candles) => {
  if (!candles || candles.length < 35) {
    return null;
  }

  const closes = candles.map(c => c.close);

  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);

  const macdLine = ema12 - ema26;

  const signalLine = calculateEMAArray([macdLine], 9);

  const signal = signalLine[signalLine.length - 1];

  const previousSignal = signalLine[signalLine.length - 2];

  let crossover = "none";

  if (macdLine > signal && ema12 > ema26) {
    crossover = "bullish";
  } else if (macdLine < signal && ema12 < ema26) {
    crossover = "bearish";
  }

  const histogram = macdLine - signal;

  let histogramTrend = "flat";

  if (histogram > 0) histogramTrend = "positive";
  if (histogram < 0) histogramTrend = "negative";

  return {
    macdLine,
    signalLine: signal,
    crossover,
    histogram,
    histogramTrend
  };
};

/**
 * EMA Calculator
 */
const calculateEMA = (data, period) => {
  const k = 2 / (period + 1);

  let ema = data[0];

  for (let i = 1; i < data.length; i++) {
    ema = data[i] * k + ema * (1 - k);
  }

  return ema;
};

/**
 * EMA for array values (signal smoothing)
 */
const calculateEMAArray = (data, period) => {
  const k = 2 / (period + 1);
  let emaArray = [data[0]];

  for (let i = 1; i < data.length; i++) {
    const ema = data[i] * k + emaArray[i - 1] * (1 - k);
    emaArray.push(ema);
  }

  return emaArray;
};
