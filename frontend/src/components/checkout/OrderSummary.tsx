import { CartSummaryEntry } from '@/types/checkout';

type OrderSummaryProps = {
  entries: CartSummaryEntry[];
  subtotalIncl: number;
  subtotalExcl: number;
  vatTotal: number;
  deliveryFee?: number | null;
  totalIncl?: number;
};

const formatCurrency = (value: number) =>
  value.toLocaleString('nl-NL', { minimumFractionDigits: 2 });

export default function OrderSummary({
  entries,
  subtotalIncl,
  subtotalExcl,
  vatTotal,
  deliveryFee,
  totalIncl,
}: OrderSummaryProps) {
  const finalTotal = totalIncl ?? subtotalIncl;
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <h2 className="text-xl font-semibold text-brand-blue mb-4">Bestelling</h2>
      <div className="space-y-4 mb-6">
        {entries.map((entry) => (
          <div key={entry.cartKey} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">{entry.title}</p>
              <p className="text-xs text-gray-500">Aantal: {entry.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-gray-900">€ {formatCurrency(entry.lineTotalIncl)}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Subtotaal (excl btw)</span>
          <span>€ {formatCurrency(subtotalExcl)}</span>
        </div>
        <div className="flex justify-between">
          <span>BTW (21%)</span>
          <span>€ {formatCurrency(vatTotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Levering</span>
          <span>{deliveryFee != null ? `€ ${formatCurrency(deliveryFee)}` : 'Offerte'}</span>
        </div>
      </div>
      <div className="border-t pt-4 mt-4 flex justify-between text-lg font-semibold text-brand-blue">
        <span>Totaal (incl btw)</span>
        <span>€ {formatCurrency(finalTotal)}</span>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Na bevestiging ga je door naar de betaalpagina van iDEAL.
      </p>
    </div>
  );
}
