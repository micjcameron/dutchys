'use client';

import React, { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionWrapper from './SectionWrapper';
import { formatCurrency } from '@/components/configurator/utils/pricing';
import type { BaseProduct, CatalogOption, ConfigSelections, SectionKey } from '@/types/catalog';

interface SummarySectionProps {
  title: string;
  description?: string;

  product: BaseProduct | null; // base product pricing
  options: CatalogOption[]; // all catalog options (single list)
  selections: ConfigSelections; // source of truth

  isCompany: boolean;
  onAddToCart: () => void;
  isDisabled?: boolean;

  // Summary is always valid; also used to hide “Volgende” in ProductConfigurator
  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;

  // ✅ new: allow jumping back to a step
  onEditSection: (section: SectionKey | 'BASE' | 'CUSTOMER') => void;
}

type LineItem = {
  key: string;
  name: string;
  quantity: number;
  unitPriceIncl: number;
  unitPriceExcl: number;
  included?: boolean;
  image?: string | null;
};

type SummaryGroup = {
  id: SectionKey | 'BASE' | 'CUSTOMER';
  titleNl: string;
  items: LineItem[];
};

const safeNum = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

type QtyMap = Record<string, number>;
const toQtyMap = (value: unknown): QtyMap => {
  // canonical: string[] (duplicates = qty)
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

const SummarySection = ({
  title,
  description,
  product,
  options,
  selections,
  isCompany,
  onAddToCart,
  isDisabled,
  setSectionGate,
  onEditSection,
}: SummarySectionProps) => {
  // Summary: always valid
  useEffect(() => {
    setSectionGate?.({ isValid: true, warning: null });
  }, [setSectionGate]);

  const optionByKey = useMemo(() => {
    const m = new Map<string, CatalogOption>();
    for (const o of options ?? []) {
      if (o?.key) m.set(o.key, o);
    }
    return m;
  }, [options]);

  const baseLine = useMemo<LineItem | null>(() => {
    if (!product) return null;

    const unitIncl = safeNum((product as any).basePriceIncl ?? (product as any).basePriceExcl ?? 0);
    const unitExcl = safeNum((product as any).basePriceExcl ?? 0);

    return {
      key: product.id,
      name: product.name ?? 'Basisproduct',
      quantity: 1,
      unitPriceIncl: unitIncl,
      unitPriceExcl: unitExcl,
      included: false,
      image: (product as any).images?.[0] ?? null,
    };
  }, [product]);

  const hydrateOptionItem = (key: string, quantity: number): LineItem | null => {
    const opt = optionByKey.get(key);
    if (!opt) {
      return {
        key,
        quantity,
        name: key,
        unitPriceIncl: 0,
        unitPriceExcl: 0,
        included: false,
        image: null,
      };
    }

    return {
      key,
      quantity,
      name: opt.name ?? key,
      unitPriceIncl: safeNum(opt.priceIncl),
      unitPriceExcl: safeNum(opt.priceExcl),
      included: Boolean((opt as any)?.included),
      image: opt.images?.[0] ?? null,
    };
  };

  const groups = useMemo<SummaryGroup[]>(() => {
    const out: SummaryGroup[] = [];

    // Helpers
    const addMany = (keys: Array<string | null | undefined>, group: SummaryGroup) => {
      for (const k of keys) {
        if (!k) continue;
        const item = hydrateOptionItem(k, 1);
        if (item) group.items.push(item);
      }
    };

    const addQtyMap = (map: QtyMap, group: SummaryGroup) => {
      for (const [k, qty] of Object.entries(map)) {
        if (!k || qty <= 0) continue;
        const item = hydrateOptionItem(k, qty);
        if (item) group.items.push(item);
      }
    };

    // ✅ Basisproduct (BASE)
    out.push({
      id: 'BASE',
      titleNl: 'Basisproduct',
      items: baseLine ? [baseLine] : [],
    });

    // ✅ Installatie (HEATER_INSTALLATION)
    out.push({
      id: 'HEATER_INSTALLATION' as SectionKey,
      titleNl: 'Installatie',
      items: selections.heaterInstallation?.optionId
        ? [hydrateOptionItem(selections.heaterInstallation.optionId, 1)!].filter(Boolean)
        : [],
    });

    // ✅ Verwarming (HEATING)
    const heatingGroup: SummaryGroup = {
      id: 'HEATING' as SectionKey,
      titleNl: 'Verwarming',
      items: [],
    };
    if (selections.heating?.optionId) {
      const item = hydrateOptionItem(selections.heating.optionId, 1);
      if (item) heatingGroup.items.push(item);
    }
    addMany(selections.heating?.extras ?? [], heatingGroup);
    out.push(heatingGroup);

    // ✅ Koeler (COOLER)
    out.push({
      id: 'COOLER' as SectionKey,
      titleNl: 'Koeler',
      items: selections.cooler?.optionId
        ? [hydrateOptionItem(selections.cooler.optionId, 1)!].filter(Boolean)
        : [],
    });

    // ✅ Materialen (MATERIALS)
    const materialsGroup: SummaryGroup = { id: 'MATERIALS' as SectionKey, titleNl: 'Materialen', items: [] };
    if (selections.materials?.internalMaterialId) {
      const item = hydrateOptionItem(selections.materials.internalMaterialId, 1);
      if (item) materialsGroup.items.push(item);
    }
    if (selections.materials?.externalMaterialId) {
      const item = hydrateOptionItem(selections.materials.externalMaterialId, 1);
      if (item) materialsGroup.items.push(item);
    }
    out.push(materialsGroup);

    // ✅ Isolatie (INSULATION)
    out.push({
      id: 'INSULATION' as SectionKey,
      titleNl: 'Isolatie',
      items: selections.insulation?.optionId
        ? [hydrateOptionItem(selections.insulation.optionId, 1)!].filter(Boolean)
        : [],
    });

    // ✅ Spa-systeem (SPA)
    out.push({
      id: 'SPA' as SectionKey,
      titleNl: 'Spa-systeem',
      items: selections.spa?.systemId ? [hydrateOptionItem(selections.spa.systemId, 1)!].filter(Boolean) : [],
    });

    // ✅ LEDs (LEDS)
    const ledsGroup: SummaryGroup = { id: 'LEDS' as SectionKey, titleNl: 'LED-verlichting', items: [] };
    addQtyMap(toQtyMap(selections.spa?.leds as any), ledsGroup);
    out.push(ledsGroup);

    // ✅ Deksel (LID)
    out.push({
      id: 'LID' as SectionKey,
      titleNl: 'Deksel',
      items: selections.lid?.optionId ? [hydrateOptionItem(selections.lid.optionId, 1)!].filter(Boolean) : [],
    });

    // ✅ Cover (COVER)
    out.push({
      id: 'COVER' as SectionKey,
      titleNl: 'Cover',
      items: selections.cover?.optionId ? [hydrateOptionItem(selections.cover.optionId, 1)!].filter(Boolean) : [],
    });

    // ✅ Filtratie (FILTRATION)
    const filtrationGroup: SummaryGroup = { id: 'FILTRATION' as SectionKey, titleNl: 'Filtratie', items: [] };
    if (selections.filtration?.filterId) {
      const item = hydrateOptionItem(selections.filtration.filterId, 1);
      if (item) filtrationGroup.items.push(item);
    }
    if (selections.filtration?.filterBoxId) {
      const item = hydrateOptionItem(selections.filtration.filterBoxId, 1);
      if (item) filtrationGroup.items.push(item);
    }
    addMany(selections.filtration?.connections ?? [], filtrationGroup);
    addMany(selections.filtration?.uv ?? [], filtrationGroup);
    out.push(filtrationGroup);

    // ✅ Trappen (STAIRS)
    out.push({
      id: 'STAIRS' as SectionKey,
      titleNl: 'Trappen',
      items: selections.stairs?.optionId ? [hydrateOptionItem(selections.stairs.optionId, 1)!].filter(Boolean) : [],
    });

    // ✅ Bedieningspaneel (CONTROLUNIT)
    out.push({
      id: 'CONTROLUNIT' as SectionKey,
      titleNl: 'Bedieningspaneel',
      items: selections.controlUnit?.optionId
        ? [hydrateOptionItem(selections.controlUnit.optionId, 1)!].filter(Boolean)
        : [],
    });

    // ✅ Extra’s (EXTRAS)
    const extrasGroup: SummaryGroup = { id: 'EXTRAS' as SectionKey, titleNl: "Extra's", items: [] };
    addQtyMap(toQtyMap(selections.extras?.optionIds as any), extrasGroup);
    out.push(extrasGroup);

    // Clean empty groups (except base)
    return out.filter((g) => g.id === 'BASE' || g.items.length > 0);
  }, [selections, optionByKey, baseLine]);

  const totals = useMemo(() => {
    let totalIncl = 0;
    let totalExcl = 0;

    for (const group of groups) {
      for (const item of group.items) {
        totalIncl += item.unitPriceIncl * item.quantity;
        totalExcl += item.unitPriceExcl * item.quantity;
      }
    }

    return { totalIncl, totalExcl };
  }, [groups]);

  const Row = ({ item }: { item: LineItem }) => {
    const unit = isCompany ? item.unitPriceExcl : item.unitPriceIncl;
    const lineTotal = unit * item.quantity;

    return (
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt=""
              className="h-10 w-10 rounded-md object-cover border shrink-0"
            />
          ) : (
            <div className="h-10 w-10 rounded-md border bg-gray-50 shrink-0" />
          )}

          <div className="min-w-0">
            <div className="text-sm text-gray-900 truncate">
              {item.name}
              {item.quantity > 1 ? ` x${item.quantity}` : ''}
              {item.included ? ' (inbegrepen)' : ''}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-900 shrink-0">€{formatCurrency(lineTotal)}</div>
      </div>
    );
  };

  const groupTotal = (g: SummaryGroup) => {
    return g.items.reduce((acc, item) => {
      const unit = isCompany ? item.unitPriceExcl : item.unitPriceIncl;
      return acc + unit * item.quantity;
    }, 0);
  };

  const canAdd = Boolean(product);

  return (
    <SectionWrapper title={title} description={description}>
      <Card>
        <CardHeader>
          <CardTitle>Prijsoverzicht</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {groups.map((g) => (
            <div key={g.id} className="rounded-2xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-base font-semibold text-brand-blue">{g.titleNl}</div>
                  <div className="text-xs text-gray-500">
                    Subtotaal: €{formatCurrency(groupTotal(g))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditSection(g.id)}
                  className="shrink-0"
                >
                  Wijzigen
                </Button>
              </div>

              <div className="mt-3 space-y-2">
                {g.items.map((item) => (
                  <Row key={item.key} item={item} />
                ))}
              </div>
            </div>
          ))}

          <div className="border-t pt-4 flex justify-between font-semibold">
            <span>Totaal</span>
            <span>€{formatCurrency(isCompany ? totals.totalExcl : totals.totalIncl)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <Button onClick={onAddToCart} disabled={!canAdd || isDisabled}>
          Voeg toe aan winkelwagen
        </Button>
      </div>
    </SectionWrapper>
  );
};

export default SummarySection;
