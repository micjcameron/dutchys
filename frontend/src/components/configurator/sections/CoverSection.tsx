'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface CoverSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const CoverSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  evaluation,
  isCompany,
}: CoverSectionProps) => {
  const selected = selections.cover?.optionId ?? null;

  const toggle = (key: string) => {
    const isSelecting = selected !== key;
    onSelectionsChange((prev) => ({
      ...prev,
      cover: {
        optionId: prev.cover?.optionId === key ? null : key,
      },
    }));
    if (isSelecting) {
      onAutoAdvance?.();
    }
  };

  return (
    <SectionWrapper title={title} description={description}>
      <OptionGrid
        options={options}
        selectedKeys={selected ? [selected] : []}
        selectionType="single"
        onToggle={toggle}
        disabledOptions={evaluation?.disabledOptions}
        hiddenOptions={evaluation?.hiddenOptions}
        isCompany={isCompany}
        emptyLabel="Geen cover-opties beschikbaar."
      />
    </SectionWrapper>
  );
};

export default CoverSection;
