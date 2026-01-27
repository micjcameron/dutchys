'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { BaseProduct, CatalogOption, ConfigSelections, EvaluationResult } from '@/types/catalog';

interface HeatingSectionProps {
  title: string;
  description?: string;
  product: BaseProduct | null;
  options: CatalogOption[];
  extras: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
}

const HeatingSection = ({
  title,
  description,
  product,
  options,
  extras,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
}: HeatingSectionProps) => {
  const rawHeatingTypes = product?.heatingTypes;
  const heatingTypes = Array.isArray(rawHeatingTypes)
    ? rawHeatingTypes.map((type) => String(type).toUpperCase())
    : null;
  const heatingOptions = heatingTypes && heatingTypes.length > 0
    ? options.filter((option) => option.tags?.some((tag) => heatingTypes.includes(tag)))
    : [];

  const selectedHeating = selections.heating?.optionId ?? null;
  const selectedExtras = selections.heating?.extras ?? [];
  const selectedHeatingOption = heatingOptions.find((option) => option.key === selectedHeating);
  const extraOptionKeys = Array.isArray(selectedHeatingOption?.attributes?.extraOptionKeys)
    ? (selectedHeatingOption?.attributes?.extraOptionKeys as string[])
    : [];
  const availableExtras = selectedHeating
    ? extraOptionKeys.length > 0
      ? extras.filter((option) => extraOptionKeys.includes(option.key))
      : extras
    : [];

  const toggleHeating = (key: string) => {
    onSelectionsChange((prev) => ({
      ...prev,
      heating: {
        ...prev.heating,
        optionId: prev.heating?.optionId === key ? null : key,
      },
    }));
  };

  const toggleExtra = (key: string) => {
    onSelectionsChange((prev) => {
      const current = new Set(prev.heating?.extras ?? []);
      if (current.has(key)) {
        current.delete(key);
      } else {
        current.add(key);
      }
      return {
        ...prev,
        heating: {
          ...prev.heating,
          extras: Array.from(current),
        },
      };
    });
  };

  return (
    <SectionWrapper title={title} description={description}>
      {heatingTypes === null && (
        <div className="text-sm text-gray-500">Verwarming is niet van toepassing voor dit product.</div>
      )}
      {heatingTypes !== null && heatingTypes.length === 0 && (
        <div className="text-sm text-gray-500">Dit product heeft geen verwarmingsopties.</div>
      )}
      {heatingTypes !== null && heatingTypes.length > 0 && (
        <OptionGrid
          options={heatingOptions}
          selectedKeys={selectedHeating ? [selectedHeating] : []}
          selectionType="single"
          onToggle={toggleHeating}
          disabledOptions={evaluation?.disabledOptions}
          hiddenOptions={evaluation?.hiddenOptions}
          isCompany={isCompany}
          emptyLabel="Geen verwarmingsopties beschikbaar voor dit model."
        />
      )}

      {availableExtras.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-blue">Extra's bij verwarming</h3>
          <OptionGrid
            options={availableExtras}
            selectedKeys={selectedExtras.filter((key) => availableExtras.some((option) => option.key === key))}
            selectionType="multi"
            onToggle={toggleExtra}
            disabledOptions={evaluation?.disabledOptions}
            hiddenOptions={evaluation?.hiddenOptions}
            isCompany={isCompany}
            emptyLabel="Geen verwarmings-extra's beschikbaar."
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default HeatingSection;
