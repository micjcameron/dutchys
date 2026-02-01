'use client';

import { useEffect, useMemo } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface ControlUnitSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  evaluation?: Pick<EvaluationResult, 'disabledOptions' | 'hiddenOptions'>;
  isCompany: boolean;

  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

const ControlUnitSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  evaluation,
  isCompany,
  setSectionGate,
}: ControlUnitSectionProps) => {
  const selected = selections.controlUnit?.optionId ?? null;

  const defaultKey = useMemo(
    () => options.find((o) => Boolean((o as any).included))?.key ?? options[0]?.key ?? null,
    [options],
  );

  // enforce default
  useEffect(() => {
    if (!selected && defaultKey) {
      onSelectionsChange((prev) => ({
        ...prev,
        controlUnit: { optionId: defaultKey },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, defaultKey]);

  // gate validity
  useEffect(() => {
    const isValid = Boolean(selected || defaultKey);
    setSectionGate?.({
      isValid,
      warning: isValid ? null : 'Kies een bedieningsoptie om door te gaan.',
    });
  }, [selected, defaultKey, setSectionGate]);

  const toggle = (key: string) => {
    if (selected === key) return; // no deselect
    onSelectionsChange((prev) => ({
      ...prev,
      controlUnit: { optionId: key },
    }));
    onAutoAdvance?.();
  };

  return (
    <SectionWrapper title={title} description={description}>
      <OptionGrid
        options={options}
        selectedKeys={selected ? [selected] : defaultKey ? [defaultKey] : []}
        selectionType="SINGLE"
        onToggle={toggle}
        disabledOptions={evaluation?.disabledOptions}
        hiddenOptions={evaluation?.hiddenOptions}
        isCompany={isCompany}
        emptyLabel="Geen bedieningsopties beschikbaar."
      />
    </SectionWrapper>
  );
};

export default ControlUnitSection;
