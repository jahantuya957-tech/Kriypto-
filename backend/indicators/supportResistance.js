/**
 * Support & Resistance Zone Detector
 * Based on swing highs & swing lows
 */

export const calculateSupportResistance = (candles) => {
  if (!candles || candles.length < 20) {
    return null;
  }

  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const closes = candles.map(c => c.close);

  // Find swing highs (resistance candidates)
  const resistanceLevels = [];
  for (let i = 2; i < highs.length - 2; i++) {
    if (
      highs[i] > highs[i - 1] &&
      highs[i] > highs[i - 2] &&
      highs[i] > highs[i + 1] &&
      highs[i] > highs[i + 2]
    ) {
      resistanceLevels.push(highs[i]);
    }
  }

  // Find swing lows (support candidates)
  const supportLevels = [];
  for (let i = 2; i < lows.length - 2; i++) {
    if (
      lows[i] < lows[i - 1] &&
      lows[i] < lows[i - 2] &&
      lows[i] < lows[i + 1] &&
      lows[i] < lows[i + 2]
    ) {
      supportLevels.push(lows[i]);
    }
  }

  const currentPrice = closes[closes.length - 1];

  const nearestSupport = findNearestLevel(supportLevels, currentPrice, "support");
  const nearestResistance = findNearestLevel(resistanceLevels, currentPrice, "resistance");

  const priceLocation = getPriceLocation(currentPrice, nearestSupport, nearestResistance);

  return {
    supportZone: supportLevels.length > 0,
    resistanceZone: resistanceLevels.length > 0,
    supportPrice: nearestSupport,
    resistancePrice: nearestResistance,
    priceLocation
  };
};

/**
 * Find nearest level
 */
const findNearestLevel = (levels, price, type) => {
  if (!levels.length) return null;

  let nearest = levels[0];
  let minDistance = Math.abs(price - nearest);

  for (let i = 1; i < levels.length; i++) {
    const distance = Math.abs(price - levels[i]);

    if (distance < minDistance) {
      minDistance = distance;
      nearest = levels[i];
    }
  }

  return nearest;
};

/**
 * Price location logic
 */
const getPriceLocation = (price, support, resistance) => {
  if (!support || !resistance) return "UNKNOWN";

  const supportThreshold = support * 1.002;
  const resistanceThreshold = resistance * 0.998;

  if (price <= supportThreshold) return "SUPPORT";
  if (price >= resistanceThreshold) return "RESISTANCE";

  return "MID";
};
