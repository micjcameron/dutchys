'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface FiltrationSectionProps {
  title: string;
  description?: string;

  baseOptions: CatalogOption[];   // FILTRATION_BASE (connections + filter)
  addonOptions: CatalogOption[];  // FILTRATION_ADDONS (uv etc.)
  boxOptions: CatalogOption[];    // FILTRATION_BOX (filter boxes)

  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const NO_FILTER_KEY = "NONE"; // ✅ use same key as backend seed

const getFiltrationType = (option: CatalogOption | null | undefined): string => {
  const t = option?.attributes?.type;
  return typeof t === 'string' ? t.toUpperCase() : '';
};

const FiltrationSection = ({
  title,
  description,
  baseOptions,
  addonOptions,
  boxOptions,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
}: FiltrationSectionProps) => {
  const disabledMap = evaluation?.disabledOptions ?? {};
  const hiddenMap = evaluation?.hiddenOptions ?? {};
  const isBlocked = (key: string) => Boolean(disabledMap[key] || hiddenMap[key]);

  const connections = baseOptions.filter((o) => getFiltrationType(o) === 'CONNECTION');

  // Filters are whatever you display in the "Filter" section.
  // If you implement NO-FILTER, keep it here so user can choose it.
  const filters = baseOptions.filter((o) => getFiltrationType(o) === 'FILTER' || o.key === NO_FILTER_KEY);

  const uvOptions = addonOptions.filter((o) => getFiltrationType(o) === 'UV');

  const selectedConnections = selections.filtration?.connections ?? [];
  const selectedFilter = selections.filtration?.filterId ?? null;
  const selectedUv = selections.filtration?.uv ?? [];
  const selectedFilterBox = selections.filtration?.filterBoxId ?? null;

  const selectedFilterOption = selectedFilter
    ? baseOptions.find((o) => o.key === selectedFilter)
    : null;

  const shouldShowFilterBoxes =
    Boolean(selectedFilterOption) &&
    getFiltrationType(selectedFilterOption) === 'FILTER' &&
    selectedFilterOption?.key !== NO_FILTER_KEY;

  const DEBUG = process.env.NODE_ENV !== 'production';

  const toggleConnection = (key: string) => {
    if (isBlocked(key)) return;

    if (DEBUG) {
      console.groupCollapsed('[FILTRATION] toggleConnection', key);
      console.log('before:', selections.filtration?.connections ?? []);
      console.log('disabled?', evaluation?.disabledOptions?.[key]);
      console.log('hidden?', evaluation?.hiddenOptions?.[key]);
    }

    onSelectionsChange((prev) => {
      const current = prev.filtration?.connections ?? [];
      const next = current.includes(key) ? [] : [key];

      const updated = {
        ...prev,
        filtration: {
          ...(prev.filtration ?? {}),
          connections: next,
        },
      };

      if (DEBUG) {
        console.log('after:', next);
        console.groupEnd();
      }

      return updated;
    });
  };

  const toggleFilter = (key: string) => {
    if (isBlocked(key)) return;

    onSelectionsChange((prev) => {
      const nextFilterId = prev.filtration?.filterId === key ? null : key;

      // ✅ clear box whenever filter changes or is removed
      return {
        ...prev,
        filtration: {
          ...(prev.filtration ?? {}),
          filterId: nextFilterId,
          filterBoxId: null,
        },
      };
    });
  };

  const toggleUv = (key: string) => {
    if (isBlocked(key)) return;

    onSelectionsChange((prev) => {
      const current = new Set(prev.filtration?.uv ?? []);
      if (current.has(key)) current.delete(key);
      else current.add(key);

      return {
        ...prev,
        filtration: {
          ...(prev.filtration ?? {}),
          uv: Array.from(current),
        },
      };
    });
  };

  const toggleFilterBox = (key: string) => {
    if (isBlocked(key)) return;

    onSelectionsChange((prev) => ({
      ...prev,
      filtration: {
        ...(prev.filtration ?? {}),
        filterBoxId: prev.filtration?.filterBoxId === key ? null : key,
      },
    }));
  };

  if (DEBUG) {
    console.groupCollapsed('[FILTRATION] incoming option counts');
    console.log('baseOptions:', baseOptions.length, baseOptions.map((o) => o.key));
    console.log('addonOptions:', addonOptions.length, addonOptions.map((o) => o.key));
    console.log('boxOptions:', boxOptions.length, boxOptions.map((o) => o.key));
    console.log('selected filterId:', selections.filtration?.filterId);
    console.groupEnd();
  }

  return (
    <SectionWrapper title={title} description={description}>
      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-blue">Verbindingen</h3>
          <OptionGrid
            options={connections}
            selectedKeys={selectedConnections}
            selectionType="SINGLE"
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
            selectionType="SINGLE"
            onToggle={toggleFilter}
            disabledOptions={evaluation?.disabledOptions}
            hiddenOptions={evaluation?.hiddenOptions}
            isCompany={isCompany}
            emptyLabel="Geen filters beschikbaar."
          />
        </div>

        {shouldShowFilterBoxes && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-brand-blue">Filterbox</h3>
            <OptionGrid
              options={boxOptions}
              selectedKeys={selectedFilterBox ? [selectedFilterBox] : []}
              selectionType="SINGLE"
              onToggle={toggleFilterBox}
              disabledOptions={evaluation?.disabledOptions}
              hiddenOptions={evaluation?.hiddenOptions}
              isCompany={isCompany}
              emptyLabel="Geen filterboxen beschikbaar."
            />
          </div>
        )}

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-blue">UV</h3>
          <OptionGrid
            options={uvOptions}
            selectedKeys={selectedUv}
            selectionType="MULTI"
            onToggle={toggleUv}
            disabledOptions={evaluation?.disabledOptions}
            hiddenOptions={evaluation?.hiddenOptions}
            isCompany={isCompany}
            emptyLabel="Geen UV-opties beschikbaar."
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default FiltrationSection;
