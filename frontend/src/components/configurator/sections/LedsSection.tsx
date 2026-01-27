'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface LedsSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const LedsSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
}: LedsSectionProps) => {
  const selected = selections.spa?.leds ?? [];

  const toggle = (key: string) => {
    onSelectionsChange((prev) => {
      const current = new Set(prev.spa?.leds ?? []);
      if (current.has(key)) {
        current.delete(key);
      } else {
        current.add(key);
      }
      return {
        ...prev,
        spa: {
          ...prev.spa,
          leds: Array.from(current),
        },
      };
    });
  };

  return (
    <SectionWrapper title={title} description={description}>
      <OptionGrid
        options={options}
        selectedKeys={selected}
        selectionType="multi"
        onToggle={toggle}
        disabledOptions={evaluation?.disabledOptions}
        hiddenOptions={evaluation?.hiddenOptions}
        isCompany={isCompany}
      />
    </SectionWrapper>
  );
};

export default LedsSection;
