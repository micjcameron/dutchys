'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface InsulationSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const InsulationSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  evaluation,
  isCompany,
}: InsulationSectionProps) => {
  const selected = selections.insulation?.optionId ?? null;

  const disabled = evaluation?.disabledOptions ?? {};
  const hidden = evaluation?.hiddenOptions ?? {};

  const toggle = (key: string) => {
    // Guard against rule constraints
    if (disabled[key] || hidden[key]) return;

    const isSelecting = selected !== key;

    onSelectionsChange((prev) => ({
      ...prev,
      insulation: {
        optionId: prev.insulation?.optionId === key ? null : key,
      },
    }));

    // Only auto-advance when selecting (not unselecting)
    if (isSelecting) {
      onAutoAdvance?.();
    }
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
      />
    </SectionWrapper>
  );
};

export default InsulationSection;
