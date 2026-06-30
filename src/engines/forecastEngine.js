export function forecastMaterial(symbol, years = 50) {
  return Array.from({ length: 6 }, (_, index) => {
    const year = Math.round((years / 5) * index);
    return {
      year,
      stability: Math.max(10, 88 - index * 4),
      costPressure: Math.min(100, 24 + index * 9),
      demand: Math.min(100, 38 + index * 11),
      risk: Math.min(100, 18 + index * 7),
      symbol,
    };
  });
}
