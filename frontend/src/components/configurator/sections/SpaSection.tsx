'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface SpaSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const SpaSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  evaluation,
  isCompany,
}: SpaSectionProps) => {
  const selected = selections.spa?.systemId ?? null;

  const disabled = evaluation?.disabledOptions ?? {};
  const hidden = evaluation?.hiddenOptions ?? {};

  const toggle = (key: string) => {
    if (disabled[key] || hidden[key]) return;

    const isSelecting = selected !== key;

    onSelectionsChange((prev) => ({
      ...prev,
      spa: {
        ...(prev.spa ?? {}),
        systemId: prev.spa?.systemId === key ? null : key,
      },
    }));

    if (isSelecting) onAutoAdvance?.();
  };

  return (
    <SectionWrapper title={title} description={description}>
      <OptionGrid
        options={options}
        selectedKeys={selected ? [selected] : []}
        selectionType="SINGLE"
        onToggle={toggle}
        disabledOptions={disabled}
        hiddenOptions={hidden}
        isCompany={isCompany}
        emptyLabel="Geen spa-systemen beschikbaar."
      />
    </SectionWrapper>
  );
};

export default SpaSection;
