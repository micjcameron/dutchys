'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type {
  BaseProduct,
  CatalogOption,
  ConfigSelections,
  EvaluationResult,
} from '@/types/catalog';

interface MaterialsSectionProps {
  title: string;
  description?: string;
  product: BaseProduct | null; // ✅ added
  internalOptions: CatalogOption[];
  externalOptions: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const DEBUG = process.env.NODE_ENV !== 'production';

const MaterialsSection = ({
  title,
  description,
  product,
  internalOptions,
  externalOptions,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
}: MaterialsSectionProps) => {
  const disabled = evaluation?.disabledOptions ?? {};
  const hidden = evaluation?.hiddenOptions ?? {};

  const selectedInternal = selections.materials?.internalMaterialId ?? null;
  const selectedExternal = selections.materials?.externalMaterialId ?? null;

  const shape = String(product?.attributes?.shape ?? (product as any)?.shape ?? '').toUpperCase();
  const isSquare = shape === 'SQUARE';

  const toggleInternal = (key: string) => {
    if (disabled[key] || hidden[key]) return;

    onSelectionsChange((prev) => ({
      ...prev,
      materials: {
        ...prev.materials,
        internalMaterialId: prev.materials?.internalMaterialId === key ? null : key,
      },
    }));
  };

  const toggleExternal = (key: string) => {
    if (disabled[key] || hidden[key]) return;

    onSelectionsChange((prev) => ({
      ...prev,
      materials: {
        ...prev.materials,
        externalMaterialId: prev.materials?.externalMaterialId === key ? null : key,
      },
    }));
  };

  if (DEBUG) {
    console.groupCollapsed('[materials] render');
    console.log('shape', shape, 'isSquare', isSquare);
    console.log('internalOptions', internalOptions.map((o) => ({ key: o.key, attrs: o.attributes })));
    console.log('externalOptions', externalOptions.map((o) => ({ key: o.key, attrs: o.attributes })));
    console.log('selected', { selectedInternal, selectedExternal });
    console.log('disabled keys', Object.keys(disabled).slice(0, 10));
    console.log('hidden keys', Object.keys(hidden).slice(0, 10));
    console.groupEnd();
  }

  return (
    <SectionWrapper title={title} description={description}>
      <div className="space-y-8">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-blue">Binnenzijde</h3>
          <OptionGrid
            options={internalOptions}
            selectedKeys={selectedInternal ? [selectedInternal] : []}
            selectionType="SINGLE"
            onToggle={toggleInternal}
            disabledOptions={disabled}
            hiddenOptions={hidden}
            isCompany={isCompany}
            emptyLabel="Geen binnenzijde opties beschikbaar."
          />
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-blue">Buitenzijde</h3>

          {isSquare && (
            <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              ✔ Stalen hoeken zijn standaard inbegrepen bij vierkante hottubs (niet apart te kiezen).
            </div>
          )}

          <OptionGrid
            options={externalOptions}
            selectedKeys={selectedExternal ? [selectedExternal] : []}
            selectionType="SINGLE"
            onToggle={toggleExternal}
            disabledOptions={disabled}
            hiddenOptions={hidden}
            isCompany={isCompany}
            emptyLabel="Geen buitenzijde opties beschikbaar."
          />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default MaterialsSection;
