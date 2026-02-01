'use client';

import React, { useEffect, useMemo } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections } from '@/types/catalog';

interface CoolerSectionProps {
  title: string;
  description?: string;

  // Pass both COOLER_BASE + COOLER_ADD_ON options in here (combined).
  options: CatalogOption[];

  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  isCompany: boolean;

  // ✅ FE-only gate (tooltip warning lives in parent)
  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

const COOLER_BASE = 'COOLER_BASE';
const COOLER_ADD_ON = 'COOLER_ADD_ON';

const DEBUG = process.env.NODE_ENV !== 'production';
const upper = (v: unknown) => String(v ?? '').trim().toUpperCase();

const CoolerSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  isCompany,
  setSectionGate,
}: CoolerSectionProps) => {
  // ✅ Robust split by groupKey (case-safe)
  const baseOptions = useMemo(
    () => (options ?? []).filter((o) => upper(o.groupKey) === COOLER_BASE),
    [options],
  );

  const addonOptions = useMemo(
    () => (options ?? []).filter((o) => upper(o.groupKey) === COOLER_ADD_ON),
    [options],
  );

  const selectedBase = selections.cooler?.optionId ?? null;

  // POC: ConfigSelections likely doesn't type cooler.addons yet → use any
  const selectedAddons: string[] = Array.isArray((selections as any).cooler?.addons)
    ? ((selections as any).cooler.addons as string[])
    : [];

  // ✅ gate: valid iff base selected
  useEffect(() => {
    const isValid = Boolean(selectedBase);
    setSectionGate?.({
      isValid,
      warning: isValid ? null : 'Kies een koeler om door te gaan.',
    });
  }, [selectedBase, setSectionGate]);

  const toggleBase = (key: string) => {
    const isSelecting = selectedBase !== key;

    onSelectionsChange((prev) => {
      const wasSelected = prev.cooler?.optionId === key;
      const nextOptionId = wasSelected ? null : key;

      return {
        ...prev,
        cooler: {
          ...(prev.cooler ?? {}),
          optionId: nextOptionId,
          // ✅ clear addons whenever base changes/toggles off (prevents ghost addons)
          addons: [],
        } as any,
      };
    });

    if (isSelecting) onAutoAdvance?.();
  };

  const toggleAddon = (key: string) => {
    if (!selectedBase) return; // addons only when base selected

    onSelectionsChange((prev) => {
      const current = new Set(((prev as any).cooler?.addons ?? []) as string[]);
      if (current.has(key)) current.delete(key);
      else current.add(key);

      return {
        ...prev,
        cooler: {
          ...(prev.cooler ?? {}),
          addons: Array.from(current),
        } as any,
      };
    });
  };

  // Defensive: if base removed, ensure addons removed too
  useEffect(() => {
    if (!selectedBase && selectedAddons.length > 0) {
      onSelectionsChange((prev) => ({
        ...prev,
        cooler: {
          ...(prev.cooler ?? {}),
          addons: [],
        } as any,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBase]);

  if (DEBUG) {
    console.groupCollapsed('[cooler] render');
    console.log('incoming options.length:', options.length);
    console.log('incoming groupKeys:', Array.from(new Set((options ?? []).map((o) => o.groupKey))));
    console.log('baseOptions.length:', baseOptions.length, baseOptions.map((o) => o.key));
    console.log('addonOptions.length:', addonOptions.length, addonOptions.map((o) => o.key));
    console.log('selectedBase:', selectedBase);
    console.log('selectedAddons:', selectedAddons);
    console.groupEnd();
  }

  return (
    <SectionWrapper title={title} description={description}>
      <OptionGrid
        options={baseOptions.length ? baseOptions : options} // fallback if parent passed base-only
        selectedKeys={selectedBase ? [selectedBase] : []}
        selectionType="SINGLE"
        onToggle={toggleBase}
        isCompany={isCompany}
        emptyLabel="Geen koeler opties beschikbaar."
      />

      {/* ✅ Add-ons only once base selected */}
      {selectedBase && addonOptions.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold text-brand-blue">Extra&apos;s bij koeler</h3>
          <OptionGrid
            options={addonOptions}
            selectedKeys={selectedAddons}
            selectionType="MULTI"
            onToggle={toggleAddon}
            isCompany={isCompany}
            emptyLabel="Geen koeler extra&apos;s beschikbaar."
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default CoolerSection;
