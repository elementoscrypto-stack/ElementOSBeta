export function materialScore(row) {
  const values = [
    row.stability,
    row.conductivity,
    row.thermal,
    row.diffusion,
    row.pressure,
    row.rarity,
    row.zdar,
  ];

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}
