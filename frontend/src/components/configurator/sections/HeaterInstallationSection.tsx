'use client';

import React, { useEffect, useMemo } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections } from '@/types/catalog';

interface HeaterInstallationSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[]; // HEATER_INSTALLATION options
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  isCompany: boolean;

  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

const DEBUG = process.env.NODE_ENV !== 'production';
const upper = (v: unknown) => String(v ?? '').trim().toUpperCase();

type HeatingMode = 'INTERNAL' | 'EXTERNAL' | 'HYBRID' | '';

const toMode = (v: unknown): HeatingMode => {
  const u = upper(v);
  return u === 'INTERNAL' || u === 'EXTERNAL' || u === 'HYBRID' ? (u as HeatingMode) : '';
};

const HeaterInstallationSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  isCompany,
  setSectionGate,
}: HeaterInstallationSectionProps) => {
  const selected = selections.heaterInstallation?.optionId ?? null;

  const selectedMode: HeatingMode = useMemo(() => {
    const opt = selected ? options.find((o) => o.key === selected) : undefined;
    return toMode((opt as any)?.attributes?.mode);
  }, [options, selected]);

  // ✅ valid iff any option selected
  useEffect(() => {
    const isValid = Boolean(selected);
    setSectionGate?.({
      isValid,
      warning: isValid ? null : 'Kies een verwarmingsmodus om door te gaan.',
    });
  }, [selected, setSectionGate]);

  /**
   * IMPORTANT:
   * When mode changes, wipe incompatible heating selections:
   * - INTERNAL/EXTERNAL => single heater (heating.optionId)
   * - HYBRID => two heaters (heating.internalOptionId + heating.externalOptionId)
   */
  useEffect(() => {
    if (!selectedMode) return;

    onSelectionsChange((prev) => {
      const heating = prev.heating ?? {};

      // If HYBRID mode: ensure single optionId cleared
      if (selectedMode === 'HYBRID') {
        if (heating.optionId) {
          return {
            ...prev,
            heating: {
              ...(prev.heating ?? {}),
              optionId: null,
              extras: [],
            },
          };
        }
        return prev;
      }

      // INTERNAL or EXTERNAL: ensure hybrid fields cleared
      const hasHybridFields =
        (heating as any).internalOptionId || (heating as any).externalOptionId;

      if (hasHybridFields) {
        return {
          ...prev,
          heating: {
            ...(prev.heating ?? {}),
            internalOptionId: null,
            externalOptionId: null,
            extras: [],
          } as any,
        };
      }

      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMode]);

  const toggle = (key: string) => {
    const isSelecting = selected !== key;

    onSelectionsChange((prev) => ({
      ...prev,
      heaterInstallation: {
        optionId: prev.heaterInstallation?.optionId === key ? null : key,
      },
    }));

    if (isSelecting) onAutoAdvance?.();
  };

  if (DEBUG) {
    console.groupCollapsed('[HEATER_INSTALLATION] render');
    console.log('selected:', selected);
    console.log('selectedMode:', selectedMode);
    console.log(
      'options:',
      (options ?? []).map((o) => ({
        key: o.key,
        mode: (o as any)?.attributes?.mode,
        appliesTo: (o as any)?.appliesTo,
      })),
    );
    console.groupEnd();
  }

  return (
    <SectionWrapper title={title} description={description}>
      <OptionGrid
        options={options}
        selectedKeys={selected ? [selected] : []}
        selectionType="SINGLE"
        onToggle={toggle}
        isCompany={isCompany}
      />
      {/* ✅ no inline warning box */}
    </SectionWrapper>
  );
};

export default HeaterInstallationSection;
