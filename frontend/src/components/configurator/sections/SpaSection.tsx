'use client';

import React, { useEffect, useMemo } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections } from '@/types/catalog';

interface SpaSectionProps {
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

const isMinimumRequired = (o: CatalogOption) => Boolean((o.attributes as any)?.minimumRequire);

const SpaSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  isCompany,
  setSectionGate,
}: SpaSectionProps) => {
  const selected = selections.spa?.systemId ?? null;

  const minimumOption = useMemo(() => {
    const mins = (options ?? []).filter(isMinimumRequired);
    return mins[0] ?? null; // assume exactly 1 minimum option
  }, [options]);

  const minimumKey = minimumOption?.key ?? null;

  // ✅ Step validity: always requires some systemId
  const isValid = Boolean(selected);

  // ✅ Gate: only show "choose" warning when options exist (spa applicable)
  useEffect(() => {
    const hasChoices = (options ?? []).length > 0;

    setSectionGate?.({
      isValid,
      warning: !isValid && hasChoices ? 'Kies een spa-systeem om door te gaan.' : null,
    });
  }, [isValid, options, setSectionGate]);

  // ✅ On first render / when options load:
  // if nothing selected, auto-select minimum required (if exists)
  useEffect(() => {
    if (selected) return;
    if (!minimumKey) return;

    onSelectionsChange((prev) => ({
      ...prev,
      spa: {
        ...(prev.spa ?? {}),
        systemId: minimumKey,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimumKey]);

  const toggle = (key: string) => {
    const isSelecting = selected !== key;

    onSelectionsChange((prev) => {
      const currentlySelected = prev.spa?.systemId ?? null;

      // user clicked the currently selected option => deselect intent
      if (currentlySelected === key) {
        // ✅ enforce minimum: if minimum exists, revert to minimum
        // - if they clicked minimum itself, keep it (cannot have none)
        if (minimumKey) {
          return {
            ...prev,
            spa: {
              ...(prev.spa ?? {}),
              systemId: minimumKey,
            },
          };
        }

        // fallback: allow null if no minimum option exists in dataset
        return {
          ...prev,
          spa: {
            ...(prev.spa ?? {}),
            systemId: null,
          },
        };
      }

      // selecting a different option
      return {
        ...prev,
        spa: {
          ...(prev.spa ?? {}),
          systemId: key,
        },
      };
    });

    if (isSelecting) onAutoAdvance?.();
  };

  const showMinimumInfo = Boolean(minimumKey) && selected === minimumKey;

  if (DEBUG) {
    console.groupCollapsed('[spa] render');
    console.log('selected:', selected);
    console.log('minimumKey:', minimumKey);
    console.log(
      'options:',
      (options ?? []).map((o) => ({
        key: o.key,
        minimum: Boolean((o.attributes as any)?.minimumRequire),
        type: (o.attributes as any)?.type,
      })),
    );
    console.log('isValid:', isValid);
    console.groupEnd();
  }

  return (
    <SectionWrapper title={title} description={description}>
      {/* Keep this: it's informational, not a "you must choose" warning */}
      {showMinimumInfo && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 mb-4">
          <b>Circulatiepomp is minimaal vereist.</b> Als je geen hydromassage- of luchtbelsysteem kiest,
          blijft deze optie geselecteerd.
        </div>
      )}

      <OptionGrid
        options={options}
        selectedKeys={selected ? [selected] : []}
        selectionType="SINGLE"
        onToggle={toggle}
        isCompany={isCompany}
        emptyLabel="Geen spa-systemen beschikbaar."
      />
    </SectionWrapper>
  );
};

export default SpaSection;
