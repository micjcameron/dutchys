'use client';

import React, { useEffect, useMemo } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { BaseProduct, CatalogOption, ConfigSelections } from '@/types/catalog';

interface CoverSectionProps {
  title: string;
  description?: string;

  // ✅ needed for appliesTo filtering (like LEDs/Materials)
  product: BaseProduct | null;

  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  evaluation?: any; // temporary
  isCompany: boolean;

  // ✅ FE-only gate (tooltip warning lives in parent)
  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

const DEBUG = process.env.NODE_ENV !== 'production';
const upper = (v: unknown) => String(v ?? '').trim().toUpperCase();

/**
 * Try to resolve the same model key you use in seed:
 * appliesTo.productModelKeys: ["HOTTUB_ROUND_200", ...]
 */
const getProductModelKey = (product: BaseProduct | null) =>
  upper(
    (product as any)?.attributes?.productKey ??
      (product as any)?.key ??
      (product as any)?.slug ??
      '',
  );

/**
 * Supports:
 * - appliesTo.productModelKeys (your hottub covers)
 * - appliesTo.productTypes (cold plunge cover example)
 * If neither is present => show always.
 *
 * If restriction exists but we can't resolve the needed product info => hide (safer).
 */
const appliesToProduct = (opt: CatalogOption, product: BaseProduct | null) => {
  const appliesTo = (opt as any)?.appliesTo ?? {};

  const modelKeys = appliesTo?.productModelKeys as string[] | undefined;
  const productTypes = appliesTo?.productTypes as string[] | undefined;

  const hasModelRestriction = Array.isArray(modelKeys) && modelKeys.length > 0;
  const hasTypeRestriction = Array.isArray(productTypes) && productTypes.length > 0;

  // no restriction => show always
  if (!hasModelRestriction && !hasTypeRestriction) return true;

  // ---- model restriction
  if (hasModelRestriction) {
    const productModelKey = getProductModelKey(product);
    if (!productModelKey) return false;
    const allowed = modelKeys!.map(upper).includes(productModelKey);
    if (!allowed) return false;
  }

  // ---- productType restriction (optional support)
  if (hasTypeRestriction) {
    const pType = upper((product as any)?.productType ?? (product as any)?.type ?? '');
    if (!pType) return false;
    const allowed = productTypes!.map(upper).includes(pType);
    if (!allowed) return false;
  }

  return true;
};

const CoverSection = ({
  title,
  description,
  product,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  evaluation,
  isCompany,
  setSectionGate,
}: CoverSectionProps) => {
  const selected = selections.cover?.optionId ?? null;

  const hidden = evaluation?.hiddenOptions ?? {};
  const disabled = evaluation?.disabledOptions ?? {};

  const visibleOptions = useMemo(() => {
    return (options ?? [])
      .filter((o) => !hidden[o.key])
      .filter((o) => appliesToProduct(o, product));
  }, [options, hidden, product]);

  // If selection is no longer visible (eg. base product changed), auto-clear it
  useEffect(() => {
    if (!selected) return;
    const stillVisible = visibleOptions.some((o) => o.key === selected);
    if (stillVisible) return;

    onSelectionsChange((prev) => ({
      ...prev,
      cover: { ...(prev.cover ?? {}), optionId: null },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, visibleOptions.map((o) => o.key).join('|')]);

  // ✅ Cover is optional => always valid (no warning)
  useEffect(() => {
    setSectionGate?.({ isValid: true, warning: null });
  }, [setSectionGate]);

  const toggle = (key: string) => {
    if (hidden?.[key]) return;
    if (disabled?.[key]) return;

    const isSelecting = selected !== key;

    onSelectionsChange((prev) => ({
      ...prev,
      cover: {
        ...(prev.cover ?? {}),
        optionId: prev.cover?.optionId === key ? null : key,
      },
    }));

    if (isSelecting) onAutoAdvance?.();
  };

  if (DEBUG) {
    console.groupCollapsed('[cover] render');
    console.log('productModelKey:', getProductModelKey(product));
    console.log('selected:', selected);
    console.log('incoming options:', (options ?? []).map((o) => ({ key: o.key, appliesTo: (o as any).appliesTo })));
    console.log('visibleOptions:', visibleOptions.map((o) => o.key));
    console.groupEnd();
  }

  return (
    <SectionWrapper title={title} description={description}>
      <OptionGrid
        options={visibleOptions}
        selectedKeys={selected ? [selected] : []}
        selectionType="SINGLE"
        onToggle={toggle}
        disabledOptions={disabled}
        hiddenOptions={hidden}
        isCompany={isCompany}
        emptyLabel="Geen cover-opties beschikbaar voor dit model."
      />
    </SectionWrapper>
  );
};

export default CoverSection;
