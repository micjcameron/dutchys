'use client';

import React, { useEffect } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections } from '@/types/catalog';

interface HeaterInstallationSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  isCompany: boolean;

  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

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

  // ✅ valid iff any option selected
  useEffect(() => {
    const isValid = Boolean(selected);
    setSectionGate?.({
      isValid,
      warning: isValid ? null : 'Kies een installatie-optie om door te gaan.',
    });
  }, [selected, setSectionGate]);

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

  if (process.env.NODE_ENV !== 'production') {
    console.groupCollapsed('[install] render');
    console.log('selected:', selected);
    console.log(
      'options:',
      options
        .filter((o) => o.groupKey === 'HEATER_INSTALLATION')
        .map((o) => ({ key: o.key, type: o.attributes?.type, appliesTo: o.appliesTo })),
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
