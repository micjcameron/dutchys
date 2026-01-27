'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface FiltrationSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const getType = (option: CatalogOption) => {
  const type = option.attributes?.type ?? option.tags?.[1];
  return typeof type === 'string' ? type.toUpperCase() : type;
};

const FiltrationSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
}: FiltrationSectionProps) => {
  const connections = options.filter((option) => getType(option) === 'CONNECTION');
  const filters = options.filter((option) => getType(option) === 'FILTER');
  const uvOptions = options.filter((option) => getType(option) === 'UV');

  const selectedConnections = selections.filtration?.connections ?? [];
  const selectedFilter = selections.filtration?.filterId ?? null;
  const selectedUv = selections.filtration?.uv ?? [];

  const toggleConnection = (key: string) => {
    onSelectionsChange((prev) => {
      const current = new Set(prev.filtration?.connections ?? []);
      if (current.has(key)) {
        current.delete(key);
      } else {
        current.add(key);
      }
      return {
        ...prev,
        filtration: {
          ...prev.filtration,
          connections: Array.from(current),
        },
      };
    });
  };

  const toggleFilter = (key: string) => {
    onSelectionsChange((prev) => ({
      ...prev,
      filtration: {
        ...prev.filtration,
        filterId: prev.filtration?.filterId === key ? null : key,
      },
    }));
  };

  const toggleUv = (key: string) => {
    onSelectionsChange((prev) => {
      const current = new Set(prev.filtration?.uv ?? []);
      if (current.has(key)) {
        current.delete(key);
      } else {
        current.add(key);
      }
      return {
        ...prev,
        filtration: {
          ...prev.filtration,
          uv: Array.from(current),
        },
      };
    });
  };

  return (
    <SectionWrapper title={title} description={description}>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-brand-blue">Verbindingen</h3>
        <OptionGrid
          options={connections}
          selectedKeys={selectedConnections}
          selectionType="multi"
          onToggle={toggleConnection}
          disabledOptions={evaluation?.disabledOptions}
          hiddenOptions={evaluation?.hiddenOptions}
          isCompany={isCompany}
          emptyLabel="Geen verbindingen beschikbaar."
        />
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-brand-blue">Filter</h3>
        <OptionGrid
          options={filters}
          selectedKeys={selectedFilter ? [selectedFilter] : []}
          selectionType="single"
          onToggle={toggleFilter}
          disabledOptions={evaluation?.disabledOptions}
          hiddenOptions={evaluation?.hiddenOptions}
          isCompany={isCompany}
          emptyLabel="Geen filters beschikbaar."
        />
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-brand-blue">UV</h3>
        <OptionGrid
          options={uvOptions}
          selectedKeys={selectedUv}
          selectionType="multi"
          onToggle={toggleUv}
          disabledOptions={evaluation?.disabledOptions}
          hiddenOptions={evaluation?.hiddenOptions}
          isCompany={isCompany}
          emptyLabel="Geen UV-opties beschikbaar."
        />
      </div>
    </SectionWrapper>
  );
};

export default FiltrationSection;
