'use client';

import React, { useMemo, useCallback } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/components/configurator/utils/pricing';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface LedsSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
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

const hasTag = (opt: CatalogOption, tag: string) =>
  (opt.tags ?? []).some((t) => String(t).toUpperCase() === tag.toUpperCase());

/**
 * UI bucketing rules:
 * - tags are authoritative (LED_BAND / LED_STRIP / INDIVIDUAL)
 * - fallback to attributes.type for legacy
 */
const getLedKind = (opt: CatalogOption): 'BAND' | 'STRIP' | 'INDIVIDUAL' | 'OTHER' => {
  if (hasTag(opt, 'LED_BAND')) return 'BAND';
  if (hasTag(opt, 'LED_STRIP')) return 'STRIP';
  if (hasTag(opt, 'INDIVIDUAL')) return 'INDIVIDUAL';

  const attrType = String(opt.attributes?.type ?? '').toUpperCase();
  if (attrType === 'BAND' || attrType === 'STRIP' || attrType === 'INDIVIDUAL') return attrType;

  return 'OTHER';
};

type Bucket = 'STRIP' | 'BAND';

const LedsSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
}: LedsSectionProps) => {
  const hidden = evaluation?.hiddenOptions ?? {};
  const disabled = evaluation?.disabledOptions ?? {};

  const visibleOptions = useMemo(() => options.filter((o) => !hidden[o.key]), [options, hidden]);

  const qtyMap = useMemo(() => toQtyMap(selections.spa?.leds as any), [selections.spa?.leds]);

  const hasQtyRule = useCallback((opt: CatalogOption) => {
    const qr = opt.quantityRule;
    return !!qr && typeof qr.min === 'number' && typeof qr.max === 'number';
  }, []);

  // -------------------------
  // Buckets
  // -------------------------
  const bandOptions = useMemo(
    () => visibleOptions.filter((o) => !hasQtyRule(o) && getLedKind(o) === 'BAND'),
    [visibleOptions, hasQtyRule],
  );

  const stripOptions = useMemo(
    () => visibleOptions.filter((o) => !hasQtyRule(o) && getLedKind(o) === 'STRIP'),
    [visibleOptions, hasQtyRule],
  );

  const bandKeys = useMemo(() => bandOptions.map((o) => o.key), [bandOptions]);
  const stripKeys = useMemo(() => stripOptions.map((o) => o.key), [stripOptions]);

  const individualQtyOptions = useMemo(
    () => visibleOptions.filter((o) => hasQtyRule(o) && getLedKind(o) === 'INDIVIDUAL'),
    [visibleOptions, hasQtyRule],
  );

  const otherTickOptions = useMemo(
    () =>
      visibleOptions.filter((o) => {
        if (hasQtyRule(o)) return false;
        const kind = getLedKind(o);
        // only show things that aren't STRIP or BAND in the fallback bucket
        return kind !== 'BAND' && kind !== 'STRIP';
      }),
    [visibleOptions, hasQtyRule],
  );

  // -------------------------
  // Quantity setter (INDIVIDUAL)
  // -------------------------
  const setQty = (opt: CatalogOption, nextQty: number) => {
    if (disabled[opt.key]) return;

    const rule = opt.quantityRule ?? {};
    const min = typeof rule.min === 'number' ? rule.min : 0;
    const max = typeof rule.max === 'number' ? rule.max : 999;
    const step = typeof rule.step === 'number' ? rule.step : 1;

    const snapped = step > 1 ? Math.round(nextQty / step) * step : nextQty;
    const qty = clamp(snapped, min, max);

    onSelectionsChange((prev) => {
      const map = toQtyMap(prev.spa?.leds as any);
      if (qty <= 0) delete map[opt.key];
      else map[opt.key] = qty;

      return {
        ...prev,
        spa: {
          ...(prev.spa ?? {}),
          leds: qtyMapToArray(map),
        },
      };
    });
  };

  // -------------------------
  // Exclusive toggle within ONE bucket only
  // - STRIP bucket: selecting a strip clears other strips (but keeps band)
  // - BAND bucket: selecting a band clears other bands (but keeps strip)
  // - clicking already selected option => deselect it
  // -------------------------
  const toggleExclusiveInBucket = (bucket: Bucket, clickedKey: string) => {
    if (disabled[clickedKey]) return;

    onSelectionsChange((prev) => {
      const map = toQtyMap(prev.spa?.leds as any);
      const isAlreadySelected = (map[clickedKey] ?? 0) > 0;

      const keysToClear = bucket === 'BAND' ? bandKeys : stripKeys;
      for (const k of keysToClear) delete map[k];

      if (!isAlreadySelected) map[clickedKey] = 1;

      return {
        ...prev,
        spa: {
          ...(prev.spa ?? {}),
          leds: qtyMapToArray(map),
        },
      };
    });
  };

  const selectedBandKey = useMemo(() => {
    for (const o of bandOptions) if ((qtyMap[o.key] ?? 0) > 0) return o.key;
    return null;
  }, [bandOptions, qtyMap]);

  const selectedStripKey = useMemo(() => {
    for (const o of stripOptions) if ((qtyMap[o.key] ?? 0) > 0) return o.key;
    return null;
  }, [stripOptions, qtyMap]);

  return (
    <SectionWrapper title={title} description={description}>
      {visibleOptions.length === 0 && (
        <div className="text-sm text-gray-500">Geen LED-opties beschikbaar.</div>
      )}

      {/* STRIP (SINGLE, within bucket) */}
      {stripOptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-blue">LED sets</h3>
          <OptionGrid
            options={stripOptions}
            selectedKeys={selectedStripKey ? [selectedStripKey] : []}
            selectionType="SINGLE"
            onToggle={(key) => toggleExclusiveInBucket('STRIP', key)}
            disabledOptions={disabled}
            hiddenOptions={hidden}
            isCompany={isCompany}
            emptyLabel="Geen LED-sets beschikbaar."
          />
        </div>
      )}

      {/* BAND (SINGLE, within bucket) */}
      {bandOptions.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold text-brand-blue">LED-band</h3>
          <OptionGrid
            options={bandOptions}
            selectedKeys={selectedBandKey ? [selectedBandKey] : []}
            selectionType="SINGLE"
            onToggle={(key) => toggleExclusiveInBucket('BAND', key)}
            disabledOptions={disabled}
            hiddenOptions={hidden}
            isCompany={isCompany}
            emptyLabel="Geen LED-banden beschikbaar."
          />
        </div>
      )}

      {/* INDIVIDUAL qty */}
      {individualQtyOptions.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold text-brand-blue">Losse LEDs</h3>

          {individualQtyOptions.map((opt) => {
            const isDisabled = Boolean(disabled[opt.key]);
            const rule = opt.quantityRule ?? {};
            const min = typeof rule.min === 'number' ? rule.min : 0;
            const max = typeof rule.max === 'number' ? rule.max : 999;
            const step = typeof rule.step === 'number' ? rule.step : 1;

            const qty = qtyMap[opt.key] ?? 0;
            const unitPrice = isCompany ? opt.priceExcl : opt.priceIncl;

            return (
              <div key={opt.key} className="rounded-2xl border p-4">
                <div className="flex items-start justify-between gap-4">
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

                  <div className="flex items-center gap-2 shrink-0">
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
                </div>

                <div className="mt-2 text-xs text-gray-500">
                  Min {min}, max {max}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Safety net */}
      {otherTickOptions.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold text-brand-blue">Overige LED-opties</h3>
          <OptionGrid
            options={otherTickOptions}
            selectedKeys={otherTickOptions
              .filter((o) => (qtyMap[o.key] ?? 0) > 0)
              .map((o) => o.key)}
            selectionType="MULTI"
            onToggle={(key) => {
              if (disabled[key]) return;

              onSelectionsChange((prev) => {
                const map = toQtyMap(prev.spa?.leds as any);
                if ((map[key] ?? 0) > 0) delete map[key];
                else map[key] = 1;

                return {
                  ...prev,
                  spa: { ...(prev.spa ?? {}), leds: qtyMapToArray(map) },
                };
              });
            }}
            disabledOptions={disabled}
            hiddenOptions={hidden}
            isCompany={isCompany}
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default LedsSection;
