'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface MaterialsSectionProps {
  title: string;
  description?: string;
  internalOptions: CatalogOption[];
  externalOptions: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const MaterialsSection = ({
  title,
  description,
  internalOptions,
  externalOptions,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
}: MaterialsSectionProps) => {
  const selectedInternal = selections.materials?.internalMaterialId ?? null;
  const selectedExternal = selections.materials?.externalMaterialId ?? null;

  const toggleInternal = (key: string) => {
    onSelectionsChange((prev) => ({
      ...prev,
      materials: {
        ...prev.materials,
        internalMaterialId: prev.materials?.internalMaterialId === key ? null : key,
      },
    }));
  };

  const toggleExternal = (key: string) => {
    onSelectionsChange((prev) => ({
      ...prev,
      materials: {
        ...prev.materials,
        externalMaterialId: prev.materials?.externalMaterialId === key ? null : key,
      },
    }));
  };

  return (
    <SectionWrapper title={title} description={description}>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-brand-blue">Interne materialen</h3>
        <OptionGrid
          options={internalOptions}
          selectedKeys={selectedInternal ? [selectedInternal] : []}
          selectionType="single"
          onToggle={toggleInternal}
          disabledOptions={evaluation?.disabledOptions}
          hiddenOptions={evaluation?.hiddenOptions}
          isCompany={isCompany}
          emptyLabel="Geen interne materialen beschikbaar."
        />
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-brand-blue">Externe materialen</h3>
        <OptionGrid
          options={externalOptions}
          selectedKeys={selectedExternal ? [selectedExternal] : []}
          selectionType="single"
          onToggle={toggleExternal}
          disabledOptions={evaluation?.disabledOptions}
          hiddenOptions={evaluation?.hiddenOptions}
          isCompany={isCompany}
          emptyLabel="Geen externe materialen beschikbaar."
        />
      </div>
    </SectionWrapper>
  );
};

export default MaterialsSection;
