const normalizeNumber = (value?: number | null) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const normalizeVat = (value?: number | null) =>
  typeof value === "number" && Number.isFinite(value) ? value : 21;

const roundCurrency = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

export const toPriceIncl = (priceExcl: number, vatRatePercent = 21) => {
  const base = normalizeNumber(priceExcl);
  const rate = normalizeVat(vatRatePercent);
  return roundCurrency(base * (1 + rate / 100));
};

export const toPriceExcl = (priceIncl: number, vatRatePercent = 21) => {
  const base = normalizeNumber(priceIncl);
  const rate = normalizeVat(vatRatePercent);
  return roundCurrency(base / (1 + rate / 100));
};
