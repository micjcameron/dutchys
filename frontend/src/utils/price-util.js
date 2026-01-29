const normalizeNumber = (value) => (Number.isFinite(value) ? value : 0);

const normalizeVat = (value) => (Number.isFinite(value) ? value : 21);

export const toPriceIncl = (priceExcl, vatRatePercent = 21) => {
  const base = normalizeNumber(priceExcl);
  const rate = normalizeVat(vatRatePercent);
  return base * (1 + rate / 100);
};

export const toPriceExcl = (priceIncl, vatRatePercent = 21) => {
  const base = normalizeNumber(priceIncl);
  const rate = normalizeVat(vatRatePercent);
  return base / (1 + rate / 100);
};
