'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface CoolerSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const CoolerSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  evaluation,
  isCompany,
}: CoolerSectionProps) => {
  const selected = selections.cooler?.optionId ?? null;

  const toggle = (key: string) => {
    const isSelecting = selected !== key;
    onSelectionsChange((prev) => ({
      ...prev,
      cooler: {
        optionId: prev.cooler?.optionId === key ? null : key,
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
        selectionType="SINGLE"
        onToggle={toggle}
        disabledOptions={evaluation?.disabledOptions}
        hiddenOptions={evaluation?.hiddenOptions}
        isCompany={isCompany}
      />
    </SectionWrapper>
  );
};

export default CoolerSection;
