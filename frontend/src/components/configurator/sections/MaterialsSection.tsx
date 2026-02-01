// ./sections/MaterialsSection.tsx
'use client';

import React, { useEffect, useMemo } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { BaseProduct, CatalogOption, ConfigSelections } from '@/types/catalog';

interface MaterialsSectionProps {
  title: string;
  description?: string;
  product: BaseProduct | null;
  internalOptions: CatalogOption[];
  externalOptions: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  isCompany: boolean;

  // ✅ FE-only validity gating (POC)
  setSectionValidity?: (isValid: boolean) => void;
}

type OptionConstraintMap = Record<string, { reason: string }>;
const DEBUG = process.env.NODE_ENV !== 'production';

const upper = (v: unknown) => String(v ?? '').trim().toUpperCase();

const MaterialsSection = ({
  title,
  description,
  product,
  internalOptions,
  externalOptions,
  selections,
  onSelectionsChange,
  isCompany,
  setSectionValidity,
}: MaterialsSectionProps) => {
  const selectedInternal = selections.materials?.internalMaterialId ?? null;
  const selectedExternal = selections.materials?.externalMaterialId ?? null;

  const shape = upper(product?.attributes?.shape ?? (product as any)?.shape ?? '');
  const isSquare = shape === 'SQUARE';

  // ✅ FE-only constraints (no evaluation)
  const { disabled, hidden } = useMemo(() => {
    const disabled: OptionConstraintMap = {};
    const hidden: OptionConstraintMap = {};

    // WPC only allowed for SQUARE (keep it disabled for non-square)
    if (!isSquare) {
      for (const opt of externalOptions ?? []) {
        const mat = upper(opt.attributes?.material);
        if (mat === 'WPC') {
          disabled[opt.key] = { reason: 'Alleen voor vierkante modellen' };
        }
      }
    }

    return { disabled, hidden };
  }, [externalOptions, isSquare]);

  // ✅ Step validity: must have BOTH internal + external selected
  const isValid = Boolean(selectedInternal) && Boolean(selectedExternal);

  useEffect(() => {
    setSectionValidity?.(isValid);
  }, [isValid, setSectionValidity]);

  const toggleInternal = (key: string) => {
    if (disabled[key] || hidden[key]) return;

    onSelectionsChange((prev) => ({
      ...prev,
      materials: {
        ...(prev.materials ?? {}),
        internalMaterialId: prev.materials?.internalMaterialId === key ? null : key,
      },
    }));
  };

  const toggleExternal = (key: string) => {
    if (disabled[key] || hidden[key]) return;

    onSelectionsChange((prev) => ({
      ...prev,
      materials: {
        ...(prev.materials ?? {}),
        externalMaterialId: prev.materials?.externalMaterialId === key ? null : key,
      },
    }));
  };

  if (DEBUG) {
    console.groupCollapsed('[materials] render');
    console.log('shape', shape, 'isSquare', isSquare);
    console.log('selected', { selectedInternal, selectedExternal, isValid });
    console.log(
      'internalOptions',
      (internalOptions ?? []).map((o) => ({ key: o.key, attrs: o.attributes })),
    );
    console.log(
      'externalOptions',
      (externalOptions ?? []).map((o) => ({ key: o.key, attrs: o.attributes })),
    );
    console.log('disabled keys', Object.keys(disabled));
    console.log('hidden keys', Object.keys(hidden));
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

        {!isValid && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Kies zowel een <b>binnenzijde</b> als <b>buitenzijde</b> om door te gaan.
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default MaterialsSection;
