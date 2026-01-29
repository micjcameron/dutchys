'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface LidSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const LidSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  evaluation,
  isCompany,
}: LidSectionProps) => {
  const selected = selections.lid?.optionId ?? null;

  const toggle = (key: string) => {
    if (evaluation?.hiddenOptions?.[key]) return;
    if (evaluation?.disabledOptions?.[key]) return;

    const isSelecting = selected !== key;

    onSelectionsChange((prev) => ({
      ...prev,
      lid: {
        ...(prev.lid ?? {}),
        optionId: prev.lid?.optionId === key ? null : key,
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
        emptyLabel="Geen deksel-opties beschikbaar."
      />
    </SectionWrapper>
  );
};

export default LidSection;
