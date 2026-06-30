export function getStripePriceId(tier) {
  const prices = {
    researcher: import.meta.env.VITE_STRIPE_RESEARCHER_PRICE,
    proLab: import.meta.env.VITE_STRIPE_PROLAB_PRICE,
  };

  return prices[tier] || null;
}
