export function compareMaterials(elements = []) {
  return elements.map((element) => ({
    symbol: element.symbol,
    name: element.name,
    stability: clamp(Math.round((100 - element.density * 5) + element.corrosionResistance * 0.35)),
    conductivity: clamp(Math.round(element.conductivity / 4)),
    thermal: clamp(element.thermalScore || 50),
    diffusion: clamp(Math.round(100 - element.density * 6)),
    pressure: clamp(Math.round(element.density * 9)),
    rarity: clamp(100 - element.atomicNumber),
    zdar: clamp(Math.round(((element.corrosionResistance || 50) + (element.thermalScore || 50)) / 2)),
  }));
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}
