'use client';

import React, { useMemo, useCallback, useEffect } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/components/configurator/utils/pricing';
import type { BaseProduct, CatalogOption, ConfigSelections } from '@/types/catalog';

interface LedsSectionProps {
  title: string;
  description?: string;
  product: BaseProduct | null;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  evaluation?: any;
  isCompany: boolean;

  // LEDs are optional => always valid
  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const upper = (v: unknown) => String(v ?? '').trim().toUpperCase();

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

type LedKind = 'BAND' | 'INDIVIDUAL' | 'INSTALLATION' | 'OTHER';

const getLedKind = (opt: CatalogOption): LedKind => {
  const t = upper(opt.attributes?.type);
  if (t === 'BAND' || t === 'INDIVIDUAL' || t === 'INSTALLATION') return t as LedKind;
  return 'OTHER';
};

type Bucket = 'BAND' | 'INSTALLATION';

const getProductModelKey = (product: BaseProduct | null) => {
  return upper(
    (product as any)?.attributes?.productKey ??
      (product as any)?.key ??
      (product as any)?.slug ??
      '',
  );
};

const appliesToProductModel = (opt: CatalogOption, productModelKey: string) => {
  const modelKeys = (opt.appliesTo as any)?.productModelKeys as string[] | undefined;

  // no restriction => show always
  if (!Array.isArray(modelKeys) || modelKeys.length === 0) return true;

  // restricted but we can't resolve current product key => hide
  if (!productModelKey) return false;

  return modelKeys.map(upper).includes(productModelKey);
};

const LedsSection = ({
  title,
  description,
  product,
  options,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
  setSectionGate,
}: LedsSectionProps) => {
  const hidden = evaluation?.hiddenOptions ?? {};
  const disabled = evaluation?.disabledOptions ?? {};

  const productModelKey = useMemo(() => getProductModelKey(product), [product]);

  const qtyMap = useMemo(() => toQtyMap(selections.spa?.leds as any), [selections.spa?.leds]);

  const hasQtyRule = useCallback((opt: CatalogOption) => {
    const qr = opt.quantityRule;
    return !!qr && typeof qr.min === 'number' && typeof qr.max === 'number';
  }, []);

  // LEDs are OPTIONAL => always valid
  useEffect(() => {
    setSectionGate?.({ isValid: true, warning: null });
  }, [setSectionGate]);

  // first hide rule-hidden, then apply appliesTo filtering
  const visibleOptions = useMemo(() => {
    return (options ?? [])
      .filter((o) => !hidden[o.key])
      .filter((o) => appliesToProductModel(o, productModelKey));
  }, [options, hidden, productModelKey]);

  // -------------------------
  // Buckets
  // -------------------------
  const installationOptions = useMemo(
    () => visibleOptions.filter((o) => !hasQtyRule(o) && getLedKind(o) === 'INSTALLATION'),
    [visibleOptions, hasQtyRule],
  );

  const bandOptions = useMemo(
    () => visibleOptions.filter((o) => !hasQtyRule(o) && getLedKind(o) === 'BAND'),
    [visibleOptions, hasQtyRule],
  );

  const installationKeys = useMemo(() => installationOptions.map((o) => o.key), [installationOptions]);
  const bandKeys = useMemo(() => bandOptions.map((o) => o.key), [bandOptions]);

  const individualQtyOptions = useMemo(
    () => visibleOptions.filter((o) => hasQtyRule(o) && getLedKind(o) === 'INDIVIDUAL'),
    [visibleOptions, hasQtyRule],
  );

  const otherTickOptions = useMemo(
    () =>
      visibleOptions.filter((o) => {
        if (hasQtyRule(o)) return false;
        const kind = getLedKind(o);
        return kind !== 'BAND' && kind !== 'INSTALLATION';
      }),
    [visibleOptions, hasQtyRule],
  );

  // -------------------------
  // Included defaults (root-level `included: true`)
  //
  // Apply defaults ONLY if nothing is selected in that bucket.
  // Never override a user's existing selection.
  // -------------------------
  useEffect(() => {
    // If there are no visible options, nothing to default
    if (visibleOptions.length === 0) return;

    const nextMap = toQtyMap(selections.spa?.leds as any);
    let changed = false;

    const hasAnySelected = (keys: string[]) => keys.some((k) => (nextMap[k] ?? 0) > 0);

    // INSTALLATION bucket default
    if (installationOptions.length > 0 && !hasAnySelected(installationKeys)) {
      const def = installationOptions.find((o) => Boolean((o as any).included));
      if (def) {
        nextMap[def.key] = 1;
        changed = true;
      }
    }

    // BAND bucket default
    if (bandOptions.length > 0 && !hasAnySelected(bandKeys)) {
      const def = bandOptions.find((o) => Boolean((o as any).included));
      if (def) {
        nextMap[def.key] = 1;
        changed = true;
      }
    }

    // OTHER tick-style defaults (multi)
    // Only add included ones if they’re not already selected.
    if (otherTickOptions.length > 0) {
      for (const o of otherTickOptions) {
        if (!Boolean((o as any).included)) continue;
        if ((nextMap[o.key] ?? 0) > 0) continue;
        nextMap[o.key] = 1;
        changed = true;
      }
    }

    if (!changed) return;

    onSelectionsChange((prev) => ({
      ...prev,
      spa: {
        ...(prev.spa ?? {}),
        leds: qtyMapToArray(nextMap),
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Key change triggers:
    productModelKey,
    visibleOptions.map((o) => o.key).join('|'),
  ]);

  // -------------------------
  // Trim stale selections if product changes and some LEDs are no longer visible
  // -------------------------
  useEffect(() => {
    const visibleKeySet = new Set(visibleOptions.map((o) => o.key));
    const current = toQtyMap(selections.spa?.leds as any);

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
      spa: {
        ...(prev.spa ?? {}),
        leds: qtyMapToArray(current),
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productModelKey, visibleOptions.map((o) => o.key).join('|')]);

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
  // Exclusive toggle within bucket
  // - INSTALLATION: single choice
  // - BAND: single choice
  // -------------------------
  const toggleExclusiveInBucket = (bucket: Bucket, clickedKey: string) => {
    if (disabled[clickedKey]) return;

    onSelectionsChange((prev) => {
      const map = toQtyMap(prev.spa?.leds as any);
      const isAlreadySelected = (map[clickedKey] ?? 0) > 0;

      const keysToClear = bucket === 'BAND' ? bandKeys : installationKeys;
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

  const selectedInstallationKey = useMemo(() => {
    for (const o of installationOptions) if ((qtyMap[o.key] ?? 0) > 0) return o.key;
    return null;
  }, [installationOptions, qtyMap]);

  const selectedBandKey = useMemo(() => {
    for (const o of bandOptions) if ((qtyMap[o.key] ?? 0) > 0) return o.key;
    return null;
  }, [bandOptions, qtyMap]);

  return (
    <SectionWrapper title={title} description={description}>
      {visibleOptions.length === 0 && (
        <div className="text-sm text-gray-500">Geen LED-opties beschikbaar.</div>
      )}

      {/* INSTALLATION (SINGLE) */}
      {installationOptions.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-blue">LED installatie</h3>
          <OptionGrid
            options={installationOptions}
            selectedKeys={selectedInstallationKey ? [selectedInstallationKey] : []}
            selectionType="SINGLE"
            onToggle={(key) => toggleExclusiveInBucket('INSTALLATION', key)}
            disabledOptions={disabled}
            hiddenOptions={hidden}
            isCompany={isCompany}
            emptyLabel="Geen LED-installatie opties beschikbaar."
          />
        </div>
      )}

      {/* BAND (SINGLE) */}
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
            emptyLabel="Geen LED-banden beschikbaar voor dit model."
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
