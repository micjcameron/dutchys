'use client';

import React, { useEffect, useMemo } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections } from '@/types/catalog';

interface InsulationSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  isCompany: boolean;

  // ✅ FE-only gate (tooltip warning lives in parent)
  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

const DEBUG = process.env.NODE_ENV !== 'production';

// ✅ choose your real key (the "Geen isolatie" option key)
const NO_INSULATION_KEY = 'INSULATION-NONE'; // <-- change to your actual "Geen isolatie" option key

const InsulationSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  isCompany,
  setSectionGate,
}: InsulationSectionProps) => {
  const selected = selections.insulation?.optionId ?? null;

  // (No evaluation currently; kept symmetric with Lid)
  const isBlocked = (_key: string) => false;

  const visibleEnabledOptions = useMemo(
    () => (options ?? []).filter((o) => !isBlocked(o.key)),
    [options],
  );

  const defaultKey = useMemo(() => {
    // Prefer NO-INSULATION if it exists and isn't blocked
    const hasNone = (options ?? []).some((o) => o.key === NO_INSULATION_KEY);
    if (hasNone && !isBlocked(NO_INSULATION_KEY)) return NO_INSULATION_KEY;

    // fallback: first visible+enabled option
    return visibleEnabledOptions[0]?.key ?? null;
  }, [options, visibleEnabledOptions]);

  // ✅ gate: INSULATION always valid (we force a default when possible)
  useEffect(() => {
    setSectionGate?.({ isValid: true, warning: null });
  }, [setSectionGate]);

  // ✅ Auto-select default on load (and if current selection ever becomes invalid)
  useEffect(() => {
    // if already selected and still valid, do nothing
    if (selected && !isBlocked(selected)) return;

    // if nothing selected OR selection became blocked -> set default
    if (!defaultKey) return; // nothing available
    onSelectionsChange((prev) => ({
      ...prev,
      insulation: {
        ...(prev.insulation ?? {}),
        optionId: defaultKey,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, defaultKey]);

  const toggle = (key: string) => {
    if (isBlocked(key)) return;

    const isSelecting = selected !== key;

    onSelectionsChange((prev) => {
      const current = prev.insulation?.optionId ?? null;

      // user clicked the same key => "deselect" intent
      if (current === key) {
        // ✅ force fallback to NO-INSULATION/default (never null)
        return {
          ...prev,
          insulation: {
            ...(prev.insulation ?? {}),
            optionId: defaultKey,
          },
        };
      }

      // switching to a different insulation
      return {
        ...prev,
        insulation: {
          ...(prev.insulation ?? {}),
          optionId: key,
        },
      };
    });

    if (isSelecting) onAutoAdvance?.();
  };

  if (DEBUG) {
    console.groupCollapsed('[insulation] render');
    console.log('selected:', selected);
    console.log('defaultKey:', defaultKey);
    console.log('options:', (options ?? []).map((o) => o.key));
    console.groupEnd();
  }

  return (
    <SectionWrapper title={title} description={description}>
      <OptionGrid
        options={options}
        selectedKeys={selected ? [selected] : defaultKey ? [defaultKey] : []}
        selectionType="SINGLE"
        onToggle={toggle}
        isCompany={isCompany}
        emptyLabel="Geen isolatie opties beschikbaar."
      />
    </SectionWrapper>
  );
};

export default InsulationSection;
