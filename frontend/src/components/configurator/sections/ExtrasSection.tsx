'use client';

import React, { useMemo, useEffect, useCallback } from 'react';
import SectionWrapper from './SectionWrapper';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/components/configurator/utils/pricing';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface ExtrasSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  evaluation?: Pick<EvaluationResult, 'disabledOptions' | 'hiddenOptions'> | any;
  isCompany: boolean;

  // Extras are optional => always valid
  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

type QtyMap = Record<string, number>;

const toQtyMap = (value: unknown): QtyMap => {
  // FE canonical: string[] (repeated keys)
  if (Array.isArray(value)) {
    const map: QtyMap = {};
    for (const k of value) {
      if (!k) continue;
      map[k] = (map[k] ?? 0) + 1;
    }
    return map;
  }

  // tolerate legacy: { KEY: number }
  if (value && typeof value === 'object') {
    const map: QtyMap = {};
    for (const [k, v] of Object.entries(value as Record<string, any>)) {
      const n = Number(v);
      if (!k || !Number.isFinite(n) || n <= 0) continue;
      map[k] = n;
    }
    return map;
  }

  return {};
};

const qtyMapToArray = (map: QtyMap): string[] =>
  Object.entries(map).flatMap(([key, qty]) => Array.from({ length: qty }, () => key));

const ExtrasSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
  setSectionGate,
}: ExtrasSectionProps) => {
  const hidden = evaluation?.hiddenOptions ?? {};
  const disabled = evaluation?.disabledOptions ?? {};

  // ✅ Extras are OPTIONAL => always valid
  useEffect(() => {
    setSectionGate?.({ isValid: true, warning: null });
  }, [setSectionGate]);

  const visibleOptions = useMemo(
    () => (options ?? []).filter((o) => !hidden[o.key]),
    [options, hidden],
  );

  const qtyMap = useMemo(
    () => toQtyMap(selections.extras?.optionIds as any),
    [selections.extras?.optionIds],
  );

  const hasQtyRule = useCallback((opt: CatalogOption) => {
    const qr = opt.quantityRule;
    return !!qr && typeof qr.min === 'number' && typeof qr.max === 'number';
  }, []);

  // In your catalog, all extras are quantity-based. Keep this defensive anyway.
  const qtyOptions = useMemo(() => visibleOptions.filter(hasQtyRule), [visibleOptions, hasQtyRule]);

  // Trim stale selections if options became hidden/removed
  useEffect(() => {
    const visibleKeySet = new Set(visibleOptions.map((o) => o.key));
    const current = toQtyMap(selections.extras?.optionIds as any);

    let changed = false;
    for (const k of Object.keys(current)) {
      if (!visibleKeySet.has(k)) {
        delete current[k];
        changed = true;
      }
    }
    if (!changed) return;

    onSelectionsChange((prev) => ({
      ...prev,
      extras: {
        ...(prev.extras ?? {}),
        optionIds: qtyMapToArray(current),
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleOptions.map((o) => o.key).join('|')]);

  // Quantity setter (same approach as LED INDIVIDUAL)
  const setQty = (opt: CatalogOption, nextQty: number) => {
    if (disabled[opt.key]) return;

    const rule = opt.quantityRule ?? {};
    const min = typeof rule.min === 'number' ? rule.min : 0;
    const max = typeof rule.max === 'number' ? rule.max : 999;
    const step = typeof rule.step === 'number' ? rule.step : 1;

    const snapped = step > 1 ? Math.round(nextQty / step) * step : nextQty;
    const qty = clamp(snapped, min, max);

    onSelectionsChange((prev) => {
      const map = toQtyMap(prev.extras?.optionIds as any);
      if (qty <= 0) delete map[opt.key];
      else map[opt.key] = qty;

      return {
        ...prev,
        extras: {
          ...(prev.extras ?? {}),
          optionIds: qtyMapToArray(map),
        },
      };
    });
  };

  return (
    <SectionWrapper title={title} description={description}>
      {qtyOptions.length === 0 && (
        <div className="text-sm text-gray-500">Geen extra’s beschikbaar.</div>
      )}

      {/* ✅ 2 columns on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {qtyOptions.map((opt) => {
          const isDisabled = Boolean(disabled[opt.key]);

          const rule = opt.quantityRule ?? {};
          const min = typeof rule.min === 'number' ? rule.min : 0;
          const max = typeof rule.max === 'number' ? rule.max : 999;
          const step = typeof rule.step === 'number' ? rule.step : 1;

          const qty = qtyMap[opt.key] ?? 0;
          const unitPrice = isCompany ? opt.priceExcl : opt.priceIncl;

          return (
            <div key={opt.key} className="rounded-2xl border p-4 flex gap-4">
              {/* IMAGE */}
              {opt.images?.[0] && (
                <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={opt.images[0]}
                    alt={opt.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* CONTENT */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="min-w-0">
                  <div className="font-medium text-gray-900">{opt.name}</div>
                  <div className="text-sm text-gray-600">{opt.description}</div>
                  <div className="mt-1 text-sm font-semibold text-brand-orange">
                    €{formatCurrency(unitPrice)}
                  </div>

                  {isDisabled && (
                    <div className="mt-2 text-sm text-red-600">{disabled[opt.key]?.reason}</div>
                  )}
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isDisabled || qty <= min}
                    onClick={() => setQty(opt, qty - step)}
                  >
                    -
                  </Button>

                  <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={qty}
                    disabled={isDisabled}
                    onChange={(e) => setQty(opt, Number(e.target.value))}
                    className="w-16 rounded-md border px-2 py-1 text-center text-sm"
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isDisabled || qty >= max}
                    onClick={() => setQty(opt, qty + step)}
                  >
                    +
                  </Button>
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  Min {min}, max {max}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default ExtrasSection;
