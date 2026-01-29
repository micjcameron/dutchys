import { toPriceExcl } from '@/utils/price-util';

export const formatCurrency = (value: number) =>
  value.toLocaleString('nl-NL', { minimumFractionDigits: 2 });

export const toExcl = (value: number, vatRatePercent = 21) =>
  Math.round(toPriceExcl(value, vatRatePercent) * 100) / 100;

export const getDisplayPrice = (
  item: { priceIncl: number; priceExcl: number },
  isCompany: boolean
) => (isCompany ? item.priceExcl : item.priceIncl);
