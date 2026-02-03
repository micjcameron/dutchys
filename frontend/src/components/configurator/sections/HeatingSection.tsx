'use client';

import React, { useEffect, useMemo } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { BaseProduct, CatalogOption, ConfigSelections, GetOption } from '@/types/catalog';

interface HeatingSectionProps {
  title: string;
  description?: string;
  product: BaseProduct | null;

  options: CatalogOption[]; // HEATING_BASE only
  extras: CatalogOption[]; // internal + external addon options (both groups)

  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;

  isCompany: boolean;
  getOption: GetOption;

  // FE-only gate
  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

const DEBUG = process.env.NODE_ENV !== 'production';
const upper = (v: unknown) => String(v ?? '').trim().toUpperCase();

type HeatingMode = 'INTERNAL' | 'EXTERNAL' | 'HYBRID' | '';
type HeaterKind = 'WOOD' | 'ELECTRIC' | 'HYBRID' | ''; // allow legacy HYBRID heater types if still present
type HeaterLocation = 'INTERNAL' | 'EXTERNAL' | 'BOTH' | '';

const GK_ADDONS_INTERNAL = 'HEATER_ADDONS_INTERNAL';
const GK_ADDONS_EXTERNAL = 'HEATER_ADDONS_EXTERNAL';

const toMode = (v: unknown): HeatingMode => {
  const u = upper(v);
  return u === 'INTERNAL' || u === 'EXTERNAL' || u === 'HYBRID' ? (u as HeatingMode) : '';
};

const toKind = (v: unknown): HeaterKind => {
  const u = upper(v);
  return u === 'WOOD' || u === 'ELECTRIC' || u === 'HYBRID' ? (u as HeaterKind) : '';
};

const toLocation = (v: unknown): HeaterLocation => {
  const u = upper(v);
  return u === 'INTERNAL' || u === 'EXTERNAL' || u === 'BOTH' ? (u as HeaterLocation) : '';
};

const toModesArray = (v: unknown): HeatingMode[] => {
  if (!Array.isArray(v)) return [];
  return v.map((x) => toMode(x)).filter(Boolean);
};

const HeatingSection = ({
  title,
  description,
  product,
  options,
  extras,
  selections,
  onSelectionsChange,
  isCompany,
  getOption,
  setSectionGate,
}: HeatingSectionProps) => {
  // -------------------------
  // Product capabilities
  // -------------------------
  const rawHeatingTypes = product?.heatingTypes;
  const heatingTypes = Array.isArray(rawHeatingTypes) ? rawHeatingTypes.map((t) => upper(t)) : null;

  // Keep these flags (your product.attributes)
  const allowsInternalHeater = (product as any)?.attributes?.allowsIntegratedHeater !== false;
  const allowsExternalHeater = (product as any)?.attributes?.allowsExternalHeater !== false;

  const isHeatingApplicable = heatingTypes !== null && (heatingTypes?.length ?? 0) > 0;

  // -------------------------
  // Selected MODE from HeaterInstallation step
  // -------------------------
  const modeKey = selections.heaterInstallation?.optionId ?? null;
  const modeOption = modeKey ? getOption(modeKey) : undefined;
  const selectedMode: HeatingMode = toMode((modeOption as any)?.attributes?.mode);

  // -------------------------
  // Normalize base options, then split by location
  // -------------------------
  const availableBase = useMemo(() => {
    if (!isHeatingApplicable) return [];

    return (options ?? [])
      .filter((opt) => {
        const kind = toKind((opt as any)?.attributes?.type);
        if (!kind) return true; // permissive fallback
        // allow HYBRID in list if you still have it; otherwise filtered by heatingTypes
        return heatingTypes!.includes(kind);
      })
      .filter((opt) => {
        const loc = toLocation((opt as any)?.attributes?.location);
        if (!loc) return true;
        if (!allowsInternalHeater && loc === 'INTERNAL') return false;
        if (!allowsExternalHeater && loc === 'EXTERNAL') return false;
        return true;
      });
  }, [allowsExternalHeater, allowsInternalHeater, heatingTypes, isHeatingApplicable, options]);

  const internalOptions = useMemo(
    () => availableBase.filter((o) => toLocation((o as any)?.attributes?.location) === 'INTERNAL'),
    [availableBase],
  );

  const externalOptions = useMemo(
    () => availableBase.filter((o) => toLocation((o as any)?.attributes?.location) === 'EXTERNAL'),
    [availableBase],
  );

  // HYBRID constraints:
  // internal = ELECTRIC only
  // external = WOOD only
  const hybridInternalOptions = useMemo(
    () => internalOptions.filter((o) => toKind((o as any)?.attributes?.type) === 'ELECTRIC'),
    [internalOptions],
  );

  const hybridExternalOptions = useMemo(
    () => externalOptions.filter((o) => toKind((o as any)?.attributes?.type) === 'WOOD'),
    [externalOptions],
  );

  // -------------------------
  // Selections
  // -------------------------
  const singleSelectedKey = selections.heating?.optionId ?? null;

  const hybridInternalKey = selections.heating?.internalOptionId ?? null;
  const hybridExternalKey = selections.heating?.externalOptionId ?? null;

  const selectedExtras = Array.isArray(selections.heating?.extras) ? selections.heating!.extras! : [];

  // -------------------------
  // Validity (gate)
  // -------------------------
  const isValid = useMemo(() => {
    if (!isHeatingApplicable) return true;
    if (!selectedMode) return false;

    if (selectedMode === 'INTERNAL' || selectedMode === 'EXTERNAL') {
      return Boolean(singleSelectedKey);
    }

    if (selectedMode === 'HYBRID') {
      return Boolean(hybridInternalKey) && Boolean(hybridExternalKey);
    }

    return false;
  }, [hybridExternalKey, hybridInternalKey, isHeatingApplicable, selectedMode, singleSelectedKey]);

  const warning = useMemo(() => {
    if (!isHeatingApplicable) return null;

    if (!selectedMode) return 'Kies eerst een verwarmingsmodus om door te gaan.';

    if (selectedMode === 'INTERNAL' || selectedMode === 'EXTERNAL') {
      return !singleSelectedKey ? 'Kies een verwarmingsoptie om door te gaan.' : null;
    }

    if (selectedMode === 'HYBRID') {
      if (!hybridExternalKey && !hybridInternalKey) {
        return 'Kies zowel een externe houtkachel als een interne elektrische kachel om door te gaan.';
      }
      if (!hybridExternalKey) return 'Kies een externe houtkachel om door te gaan.';
      if (!hybridInternalKey) return 'Kies een interne elektrische kachel om door te gaan.';
      return null;
    }

    return null;
  }, [hybridExternalKey, hybridInternalKey, isHeatingApplicable, selectedMode, singleSelectedKey]);

  useEffect(() => {
    setSectionGate?.({ isValid, warning });
  }, [isValid, warning, setSectionGate]);

  // -------------------------
  // Cleanup on mode change
  // -------------------------
  useEffect(() => {
    if (!selectedMode) return;

    onSelectionsChange((prev) => {
      const heating = prev.heating ?? {};

      // INTERNAL/EXTERNAL => clear hybrid fields
      if (selectedMode === 'INTERNAL' || selectedMode === 'EXTERNAL') {
        const hasHybrid = Boolean(heating.internalOptionId || heating.externalOptionId);
        if (!hasHybrid) return prev;

        return {
          ...prev,
          heating: {
            ...(prev.heating ?? {}),
            internalOptionId: null,
            externalOptionId: null,
            extras: [],
          },
        };
      }

      // HYBRID => clear single optionId
      if (selectedMode === 'HYBRID') {
        if (!heating.optionId) return prev;

        return {
          ...prev,
          heating: {
            ...(prev.heating ?? {}),
            optionId: null,
            extras: [],
          },
        };
      }

      return prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMode]);

  // HYBRID: auto-trim invalid picks
  useEffect(() => {
    if (selectedMode !== 'HYBRID') return;

    const internalOk = !hybridInternalKey
      ? true
      : hybridInternalOptions.some((o) => o.key === hybridInternalKey);

    const externalOk = !hybridExternalKey
      ? true
      : hybridExternalOptions.some((o) => o.key === hybridExternalKey);

    if (internalOk && externalOk) return;

    onSelectionsChange((prev) => ({
      ...prev,
      heating: {
        ...(prev.heating ?? {}),
        internalOptionId: internalOk ? prev.heating?.internalOptionId ?? null : null,
        externalOptionId: externalOk ? prev.heating?.externalOptionId ?? null : null,
        extras: [],
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedMode,
    hybridInternalKey,
    hybridExternalKey,
    hybridInternalOptions.map((o) => o.key).join('|'),
    hybridExternalOptions.map((o) => o.key).join('|'),
  ]);

  // -------------------------
  // Add-ons (new model)
  // attributes: { modes: HeatingMode[], heatingType: HeatingType }
  // We show add-ons when there is a selected WOOD heater in the relevant "wood context"
  // - INTERNAL/EXTERNAL: wood context = selected single heater (if WOOD)
  // - HYBRID: wood context = selected external heater (WOOD by design)
  // -------------------------
  const woodContextKey = useMemo(() => {
    if (!selectedMode) return null;
    if (selectedMode === 'HYBRID') return hybridExternalKey; // external wood in hybrid
    return singleSelectedKey;
  }, [hybridExternalKey, selectedMode, singleSelectedKey]);

  const woodContextOption = woodContextKey ? getOption(woodContextKey) : undefined;
  const woodContextKind: HeaterKind = toKind((woodContextOption as any)?.attributes?.type);
  const woodContextLocation: HeaterLocation = toLocation((woodContextOption as any)?.attributes?.location);

  const shouldShowExtras = Boolean(woodContextKey) && woodContextKind === 'WOOD' && Boolean(selectedMode);

  const allowedAddonGroupKey =
    woodContextLocation === 'EXTERNAL'
      ? GK_ADDONS_EXTERNAL
      : woodContextLocation === 'INTERNAL'
        ? GK_ADDONS_INTERNAL
        : null;

  const availableExtras = useMemo(() => {
    if (!shouldShowExtras || !selectedMode || !allowedAddonGroupKey) return [];

    return (extras ?? [])
      // group split
      .filter((o) => upper(o.groupKey) === upper(allowedAddonGroupKey))
      // must include mode
      .filter((o) => {
        const modes = toModesArray((o as any)?.attributes?.modes);
        return modes.length === 0 ? true : modes.includes(selectedMode);
      })
      // must match heatingType (WOOD)
      .filter((o) => {
        const ht = toKind((o as any)?.attributes?.heatingType);
        return ht ? ht === woodContextKind : true;
      });
  }, [allowedAddonGroupKey, extras, selectedMode, shouldShowExtras, woodContextKind]);

  const normalizedSelectedExtras = useMemo(
    () => selectedExtras.filter((k) => availableExtras.some((o) => o.key === k)),
    [availableExtras, selectedExtras],
  );

  // Auto-trim stale extras OR clear if extras should not be shown
  useEffect(() => {
    if (!shouldShowExtras) {
      if (selectedExtras.length > 0) {
        onSelectionsChange((prev) => ({
          ...prev,
          heating: {
            ...(prev.heating ?? {}),
            extras: [],
          },
        }));
      }
      return;
    }

    if (normalizedSelectedExtras.length === selectedExtras.length) return;

    onSelectionsChange((prev) => ({
      ...prev,
      heating: {
        ...(prev.heating ?? {}),
        extras: normalizedSelectedExtras,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShowExtras, normalizedSelectedExtras.join('|')]);

  // -------------------------
  // Actions
  // -------------------------
  const toggleSingle = (key: string) => {
    onSelectionsChange((prev) => {
      const wasSelected = prev.heating?.optionId === key;
      const nextOptionKey = wasSelected ? null : key;

      return {
        ...prev,
        heating: {
          ...(prev.heating ?? {}),
          optionId: nextOptionKey,
          extras: [],
        },
      };
    });
  };

  const toggleHybridInternal = (key: string) => {
    onSelectionsChange((prev) => {
      const cur = prev.heating?.internalOptionId ?? null;
      const next = cur === key ? null : key;

      return {
        ...prev,
        heating: {
          ...(prev.heating ?? {}),
          internalOptionId: next,
          extras: [],
        },
      };
    });
  };

  const toggleHybridExternal = (key: string) => {
    onSelectionsChange((prev) => {
      const cur = prev.heating?.externalOptionId ?? null;
      const next = cur === key ? null : key;

      return {
        ...prev,
        heating: {
          ...(prev.heating ?? {}),
          externalOptionId: next,
          extras: [],
        },
      };
    });
  };

  const toggleExtra = (key: string) => {
    if (!shouldShowExtras) return;
    if (!availableExtras.some((o) => o.key === key)) return;

    onSelectionsChange((prev) => {
      const current = new Set(prev.heating?.extras ?? []);
      if (current.has(key)) current.delete(key);
      else current.add(key);

      return {
        ...prev,
        heating: {
          ...(prev.heating ?? {}),
          extras: Array.from(current),
        },
      };
    });
  };

  // -------------------------
  // Debug
  // -------------------------
  if (DEBUG) {
    console.groupCollapsed('[HEATING] render');
    console.log('productKey:', (product as any)?.key ?? (product as any)?.slug ?? '(null)');
    console.log('heatingTypes:', heatingTypes);
    console.log('selectedMode:', selectedMode);
    console.log('singleSelectedKey:', singleSelectedKey);
    console.log('hybridInternalKey:', hybridInternalKey);
    console.log('hybridExternalKey:', hybridExternalKey);
    console.log('counts:', {
      availableBase: availableBase.length,
      internalOptions: internalOptions.length,
      externalOptions: externalOptions.length,
      hybridInternalOptions: hybridInternalOptions.length,
      hybridExternalOptions: hybridExternalOptions.length,
    });
    console.log('isValid:', isValid, 'warning:', warning);

    console.log('woodContextKey:', woodContextKey);
    console.log('woodContextKind:', woodContextKind);
    console.log('woodContextLocation:', woodContextLocation);
    console.log('shouldShowExtras:', shouldShowExtras);
    console.log('allowedAddonGroupKey:', allowedAddonGroupKey);
    console.log(
      'availableExtras:',
      availableExtras.map((o) => ({
        key: o.key,
        groupKey: o.groupKey,
        modes: (o as any)?.attributes?.modes,
        heatingType: (o as any)?.attributes?.heatingType,
      })),
    );
    console.log('selectedExtras:', selectedExtras);
    console.groupEnd();
  }

  // -------------------------
  // Render
  // -------------------------
  return (
    <SectionWrapper title={title} description={description}>
      {!isHeatingApplicable && (
        <div className="text-sm text-gray-500">Verwarming is niet van toepassing voor dit product.</div>
      )}

      {isHeatingApplicable && !selectedMode && (
        <div className="text-sm text-gray-500">
          Kies eerst een verwarmingsmodus (intern/extern/hybride) om verwarmingsopties te zien.
        </div>
      )}

      {isHeatingApplicable && selectedMode === 'INTERNAL' && (
        <OptionGrid
          options={internalOptions}
          selectedKeys={singleSelectedKey ? [singleSelectedKey] : []}
          selectionType="SINGLE"
          onToggle={toggleSingle}
          isCompany={isCompany}
          emptyLabel="Geen interne verwarmingsopties beschikbaar voor dit model."
        />
      )}

      {isHeatingApplicable && selectedMode === 'EXTERNAL' && (
        <OptionGrid
          options={externalOptions}
          selectedKeys={singleSelectedKey ? [singleSelectedKey] : []}
          selectionType="SINGLE"
          onToggle={toggleSingle}
          isCompany={isCompany}
          emptyLabel="Geen externe verwarmingsopties beschikbaar voor dit model."
        />
      )}

      {isHeatingApplicable && selectedMode === 'HYBRID' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-end justify-between gap-4">
              <h3 className="text-lg font-semibold text-brand-blue">Externe houtkachel</h3>
              <div className="text-xs text-gray-500">Vereist</div>
            </div>

            <OptionGrid
              options={hybridExternalOptions}
              selectedKeys={hybridExternalKey ? [hybridExternalKey] : []}
              selectionType="SINGLE"
              onToggle={toggleHybridExternal}
              isCompany={isCompany}
              emptyLabel="Geen externe houtkachels beschikbaar voor dit model."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between gap-4">
              <h3 className="text-lg font-semibold text-brand-blue">Interne elektrische kachel</h3>
              <div className="text-xs text-gray-500">Vereist</div>
            </div>

            <OptionGrid
              options={hybridInternalOptions}
              selectedKeys={hybridInternalKey ? [hybridInternalKey] : []}
              selectionType="SINGLE"
              onToggle={toggleHybridInternal}
              isCompany={isCompany}
              emptyLabel="Geen interne elektrische kachels beschikbaar voor dit model."
            />
          </div>
        </div>
      )}

      {shouldShowExtras && availableExtras.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold text-brand-blue">Extra&apos;s bij verwarming</h3>
          <OptionGrid
            options={availableExtras}
            selectedKeys={normalizedSelectedExtras}
            selectionType="MULTI"
            onToggle={toggleExtra}
            isCompany={isCompany}
            emptyLabel="Geen verwarmings-extra&apos;s beschikbaar."
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default HeatingSection;
