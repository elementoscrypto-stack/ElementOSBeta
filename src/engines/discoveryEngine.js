export function createDiscoveryCard(title, description) {
  return {
    title,
    description,
    score: Math.floor(70 + Math.random() * 30),
  };
}
