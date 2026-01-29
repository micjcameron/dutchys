'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface HeaterInstallationSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const HeaterInstallationSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  evaluation,
  isCompany,
}: HeaterInstallationSectionProps) => {
  const selected = selections.heaterInstallation?.optionId ?? null;

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
        disabledOptions={evaluation?.disabledOptions}
        hiddenOptions={evaluation?.hiddenOptions}
        isCompany={isCompany}
      />
    </SectionWrapper>
  );
};

export default HeaterInstallationSection;
