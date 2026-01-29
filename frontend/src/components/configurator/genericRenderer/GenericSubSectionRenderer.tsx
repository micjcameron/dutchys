'use client';

import type { CatalogOption, ConfigSelections, EvaluationResult, OptionGroupDTO } from '@/types/catalog';
import OptionGrid from '../sections/OptionGrid';

type SelectionKind = 'single' | 'multi' | 'boolean';

type SubSectionDef = {
  key: string;
  title: string;
  selectionType: 'SINGLE' | 'MULTI' | 'BOOLEAN';
  min?: number | null;
  max?: number | null;
  sortOrder?: number;
};

type SubSectionSelectionAdapter = {
  /** Return selected option keys for this subsection */
  getSelectedKeys: (selections: ConfigSelections) => string[];
  /** Toggle an option key for this subsection */
  toggle: (prev: ConfigSelections, optionKey: string) => ConfigSelections;
  /** override selection type if you want */
  selectionKind?: SelectionKind;
};

export type GenericSubSectionRendererProps = {
  groupKey: string;
  baseGroup: OptionGroupDTO | null;
  baseOptions: CatalogOption[];
  addonGroup?: OptionGroupDTO | null;
  addonOptions?: CatalogOption[];
  /**
   * If true, render addons as an extra subsection at the bottom
   * even if baseGroup.subSections doesn't include it.
   */
  appendAddonsSubSection?: boolean;

  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;

  evaluation: EvaluationResult | null;
  isCompany: boolean;

  /** adapter per subsection key */
  adapters: Record<string, SubSectionSelectionAdapter>;

  /** optional: map incoming option.subKey values to subsection keys */
  subKeyAliases?: Record<string, string>;
};

const selectionTypeToKind = (t: SubSectionDef['selectionType']): SelectionKind => {
  if (t === 'SINGLE') return 'single';
  if (t === 'MULTI') return 'multi';
  return 'boolean';
};

const normalizeSubKey = (raw: string | null | undefined, aliases?: Record<string, string>) => {
  if (!raw) return null;
  const key = raw.toUpperCase();
  return aliases?.[key] ?? key;
};

export default function GenericSubSectionRenderer({
  groupKey,
  baseGroup,
  baseOptions,
  addonGroup,
  addonOptions,
  appendAddonsSubSection = true,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
  adapters,
  subKeyAliases,
}: GenericSubSectionRendererProps) {
  const baseSubSections = (baseGroup?.subSections ?? []) as SubSectionDef[];

  // Build final subsection list
  const subSections: SubSectionDef[] = [...baseSubSections].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  // Add addons subsection at bottom (data-driven-ish)
  const hasAddons = subSections.some((s) => s.key === 'ADDONS');
  if (appendAddonsSubSection && !hasAddons && (addonOptions?.length ?? 0) > 0) {
    subSections.push({
      key: 'ADDONS',
      title: addonGroup?.title ?? "Extra's",
      selectionType: 'MULTI',
      min: 0,
      max: null,
      sortOrder: 9999,
    });
  }

  // Merge options: base + addons (so renderer can treat ADDONS like any other)
  const mergedOptions: CatalogOption[] = [
    ...baseOptions,
    ...(addonOptions ?? []).map((o) => ({
      ...o,
      // force addons into a "ADDONS" subKey unless already set
      subKey: o.subKey ?? 'ADDONS',
    })),
  ];

  // group by normalized subKey
  const bySubKey = new Map<string, CatalogOption[]>();
  for (const opt of mergedOptions) {
    const subKey = normalizeSubKey(opt.subKey ?? null, subKeyAliases);
    if (!subKey) continue;
    const arr = bySubKey.get(subKey) ?? [];
    arr.push(opt);
    bySubKey.set(subKey, arr);
  }

  return (
    <div className="space-y-6">
      {subSections.map((sub) => {
        const key = sub.key.toUpperCase();
        const optionsForSub = bySubKey.get(key) ?? [];

        const adapter = adapters[key];
        if (!adapter) {
          // If you want hard failure while you’re wiring: throw here.
          console.warn(`[${groupKey}] Missing adapter for subsection`, key);
          return null;
        }

        const selectedKeys = adapter.getSelectedKeys(selections);
        const selectionKind = adapter.selectionKind ?? selectionTypeToKind(sub.selectionType);

        const onToggle = (optionKey: string) => {
          onSelectionsChange((prev) => adapter.toggle(prev, optionKey));
        };

        return (
          <div key={key} className="space-y-3">
            <h3 className="text-lg font-semibold text-brand-blue">{sub.title}</h3>
            <OptionGrid
              options={optionsForSub}
              selectedKeys={selectedKeys}
              selectionType={selectionKind}
              onToggle={onToggle}
              disabledOptions={evaluation?.disabledOptions}
              hiddenOptions={evaluation?.hiddenOptions}
              isCompany={isCompany}
              emptyLabel="Geen opties beschikbaar."
            />
          </div>
        );
      })}
    </div>
  );
}
