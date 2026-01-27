export const formatCurrency = (value: number) =>
  value.toLocaleString('nl-NL', { minimumFractionDigits: 2 });

export const toExcl = (value: number) => Math.round((value / 1.21) * 100) / 100;

export const getDisplayPrice = (
  item: { priceIncl: number; priceExcl: number },
  isCompany: boolean
) => (isCompany ? item.priceExcl : item.priceIncl);
