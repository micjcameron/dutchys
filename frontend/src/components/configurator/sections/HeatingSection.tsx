'use client';

import React, { useEffect, useMemo } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { BaseProduct, CatalogOption, ConfigSelections, GetOption } from '@/types/catalog';

interface HeatingSectionProps {
  title: string;
  description?: string;
  product: BaseProduct | null;
  options: CatalogOption[]; // HEATING_BASE only (parent passes by groupKey)
  extras: CatalogOption[]; // internal+external addon options (both groups)
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  isCompany: boolean;
  getOption: GetOption;

  // ✅ FE-only gate (tooltip warning lives in parent)
  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

const HEATER_ADDONS_INTERNAL = 'HEATER_ADDONS_INTERNAL';
const HEATER_ADDONS_EXTERNAL = 'HEATER_ADDONS_EXTERNAL';

type OptionConstraintMap = Record<string, { reason: string }>;
const DEBUG = process.env.NODE_ENV !== 'production';

const upper = (v: unknown) => String(v ?? '').trim().toUpperCase();

type InstallType = 'EXTERNAL' | 'INTEGRATED' | '';
type HeaterKind = 'WOOD' | 'ELECTRIC' | 'HYBRID' | '';

const toInstallType = (v: unknown): InstallType => {
  const u = upper(v);
  return u === 'EXTERNAL' || u === 'INTEGRATED' ? (u as InstallType) : '';
};

const toHeaterKind = (v: unknown): HeaterKind => {
  const u = upper(v);
  return u === 'WOOD' || u === 'ELECTRIC' || u === 'HYBRID' ? (u as HeaterKind) : '';
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
  // product capability + heating types
  // -------------------------
  const rawHeatingTypes = product?.heatingTypes;
  const heatingTypes = Array.isArray(rawHeatingTypes) ? rawHeatingTypes.map((t) => upper(t)) : null;

  const allowsIntegratedHeater = product?.attributes?.allowsIntegratedHeater !== false;
  const allowsExternalHeater = product?.attributes?.allowsExternalHeater !== false;

  // No backend evaluation anymore
  const disabled: OptionConstraintMap = {};
  const hidden: OptionConstraintMap = {};
  const isDisabled = (key: string) => Boolean(disabled[key]);
  const isHidden = (key: string) => Boolean(hidden[key]);

  // -------------------------
  // Installation type from selections (HeaterInstallation step)
  // NOTE: your install option uses attributes.type = EXTERNAL|INTEGRATED
  // -------------------------
  const installKey = (selections.heaterInstallation?.optionId ?? null) as string | null;
  const installOption = installKey ? getOption(installKey) : undefined;
  const selectedInstallType: InstallType = toInstallType(installOption?.attributes?.type);

  // -------------------------
  // Heating base options
  // -------------------------
  const heatingOptions = useMemo(() => {
    if (heatingTypes === null) return []; // not applicable
    if (heatingTypes.length === 0) return []; // applicable but none
    return (options ?? [])
      .filter((opt) => {
        const kind = toHeaterKind(opt.attributes?.type); // WOOD | ELECTRIC | HYBRID
        if (!kind) return true; // permissive fallback
        return heatingTypes.includes(kind);
      })
      .filter((opt) => {
        const heaterInstallType = toInstallType(opt.attributes?.installationType); // EXTERNAL | INTEGRATED
        if (!allowsIntegratedHeater && heaterInstallType === 'INTEGRATED') return false;
        if (!allowsExternalHeater && heaterInstallType === 'EXTERNAL') return false;

        // If user chose installation, respect it when heater declares installationType
        if (selectedInstallType && heaterInstallType && selectedInstallType !== heaterInstallType) return false;

        return true;
      });
  }, [allowsExternalHeater, allowsIntegratedHeater, heatingTypes, options, selectedInstallType]);

  // -------------------------
  // Selections
  // -------------------------
  const selectedHeatingKey = (selections.heating?.optionId ?? null) as string | null;
  const selectedHeatingOption = selectedHeatingKey ? getOption(selectedHeatingKey) : undefined;

  const selectedExtras = Array.isArray(selections.heating?.extras) ? selections.heating!.extras! : [];

  const selectedHeaterKind: HeaterKind = toHeaterKind(selectedHeatingOption?.attributes?.type);
  const selectedHeaterInstallType: InstallType = toInstallType(selectedHeatingOption?.attributes?.installationType);

  // effective install type: prefer heater's own installationType, fallback to selected installation step
  const effectiveInstallType: InstallType = selectedHeaterInstallType || selectedInstallType || '';

  const allowedAddonGroupKey =
    effectiveInstallType === 'EXTERNAL'
      ? HEATER_ADDONS_EXTERNAL
      : effectiveInstallType === 'INTEGRATED'
        ? HEATER_ADDONS_INTERNAL
        : null;

  // Extra keys come from the selected HEATING option (truth source)
  const extraOptionKeys = Array.isArray(selectedHeatingOption?.attributes?.extraOptionKeys)
    ? (selectedHeatingOption?.attributes?.extraOptionKeys as string[]).filter(Boolean)
    : [];

  // ✅ Extras only if a WOOD heater is selected + we can resolve internal/external
  const shouldShowExtras =
    Boolean(selectedHeatingKey) && selectedHeaterKind === 'WOOD' && Boolean(allowedAddonGroupKey);

  const availableExtras = useMemo(() => {
    if (!shouldShowExtras || !allowedAddonGroupKey) return [];
    return (extras ?? [])
      .filter((o) => o.groupKey === allowedAddonGroupKey)
      .filter((o) => (extraOptionKeys.length ? extraOptionKeys.includes(o.key) : true));
  }, [allowedAddonGroupKey, extraOptionKeys, extras, shouldShowExtras]);

  const normalizedSelectedExtras = useMemo(
    () => selectedExtras.filter((k) => availableExtras.some((o) => o.key === k)),
    [availableExtras, selectedExtras],
  );

  // ✅ Section validity: only requires a heater selected (extras do NOT matter)
  const isValid = Boolean(selectedHeatingKey);

  useEffect(() => {
    // Only show the warning when heating is applicable and there are options to choose
    const showWarning = heatingTypes !== null && (heatingTypes?.length ?? 0) > 0;

    setSectionGate?.({
      isValid,
      warning: !isValid && showWarning ? 'Kies een verwarmingsoptie om door te gaan.' : null,
    });
  }, [isValid, setSectionGate, heatingTypes]);

  // Auto-trim stale extras when availability changes (no setState during render)
  useEffect(() => {
    if (!selectedHeatingKey) return;
    if (normalizedSelectedExtras.length === selectedExtras.length) return;

    onSelectionsChange((prev) => ({
      ...prev,
      heating: {
        ...(prev.heating ?? {}),
        extras: normalizedSelectedExtras,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHeatingKey, normalizedSelectedExtras.join('|')]);

  // -------------------------
  // Actions
  // -------------------------
  const toggleHeating = (key: string) => {
    if (DEBUG) {
      console.groupCollapsed('[HEATING] toggleHeating', key);
      console.log('before selections.heating:', selections.heating);
      console.log('selectedInstallType:', selectedInstallType);
      console.log('disabled?', isDisabled(key), disabled[key]?.reason);
      console.log('hidden?', isHidden(key), hidden[key]?.reason);
    }

    if (isDisabled(key) || isHidden(key)) {
      if (DEBUG) {
        console.log('blocked toggle (disabled/hidden)');
        console.groupEnd();
      }
      return;
    }

    onSelectionsChange((prev) => {
      const wasSelected = prev.heating?.optionId === key;
      const nextOptionKey = wasSelected ? null : key;

      // ✅ Always clear extras when heating changes
      const next: ConfigSelections = {
        ...prev,
        heating: {
          ...(prev.heating ?? {}),
          optionId: nextOptionKey,
          extras: [],
        },
      };

      if (DEBUG) {
        console.log('after selections.heating:', next.heating);
        console.groupEnd();
      }
      return next;
    });
  };

  const toggleExtra = (key: string) => {
    if (DEBUG) {
      console.groupCollapsed('[HEATING] toggleExtra', key);
      console.log('before selections.heating:', selections.heating);
      console.log('shouldShowExtras:', shouldShowExtras);
      console.log('allowedAddonGroupKey:', allowedAddonGroupKey);
    }

    if (!shouldShowExtras) {
      if (DEBUG) {
        console.log('blocked toggle (extras not allowed)');
        console.groupEnd();
      }
      return;
    }

    if (isDisabled(key) || isHidden(key)) {
      if (DEBUG) {
        console.log('blocked toggle (disabled/hidden)');
        console.groupEnd();
      }
      return;
    }

    if (!availableExtras.some((o) => o.key === key)) {
      if (DEBUG) {
        console.warn('[HEATING] tried to toggle non-available extra', key);
        console.groupEnd();
      }
      return;
    }

    onSelectionsChange((prev) => {
      const current = new Set(prev.heating?.extras ?? []);
      if (current.has(key)) current.delete(key);
      else current.add(key);

      const next: ConfigSelections = {
        ...prev,
        heating: {
          ...(prev.heating ?? {}),
          extras: Array.from(current),
        },
      };

      if (DEBUG) {
        console.log('after selections.heating:', next.heating);
        console.groupEnd();
      }
      return next;
    });
  };

  // -------------------------
  // Debug logs
  // -------------------------
  if (DEBUG) {
    console.groupCollapsed('[HEATING] render');
    console.log('productKey:', (product as any)?.attributes?.productKey ?? (product as any)?.slug ?? '(null)');
    console.log('rawHeatingTypes:', rawHeatingTypes);
    console.log('heatingTypes:', heatingTypes);
    console.log('allowsIntegratedHeater:', allowsIntegratedHeater, 'allowsExternalHeater:', allowsExternalHeater);

    console.log('installKey:', installKey);
    console.log('selectedInstallType:', selectedInstallType);

    console.log('selectedHeatingKey:', selectedHeatingKey);
    console.log('selectedHeaterKind(attributes.type):', selectedHeaterKind);
    console.log('selectedHeaterInstallType(attributes.installationType):', selectedHeaterInstallType);

    console.log('effectiveInstallType:', effectiveInstallType);
    console.log('allowedAddonGroupKey:', allowedAddonGroupKey);

    console.log('heatingOptions count:', heatingOptions.length);
    console.log(
      'heatingOptions:',
      heatingOptions.map((o) => [o.key, upper(o.attributes?.type), upper(o.attributes?.installationType)]),
    );

    console.log('isValid:', isValid);

    console.log('extras incoming:', extras.length);
    console.log('extraOptionKeys:', extraOptionKeys);
    console.log('shouldShowExtras:', shouldShowExtras);
    console.log('availableExtras:', availableExtras.map((o) => ({ key: o.key, groupKey: o.groupKey })));
    console.log('selectedExtras:', selectedExtras);
    console.groupEnd();
  }

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
          selectedKeys={selectedHeatingKey ? [selectedHeatingKey] : []}
          selectionType="SINGLE"
          onToggle={toggleHeating}
          disabledOptions={disabled}
          hiddenOptions={hidden}
          isCompany={isCompany}
          emptyLabel="Geen verwarmingsopties beschikbaar voor dit model."
        />
      )}

      {/* Extras only when WOOD + installation resolves */}
      {shouldShowExtras && availableExtras.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="text-lg font-semibold text-brand-blue">Extra&apos;s bij verwarming</h3>
          <OptionGrid
            options={availableExtras}
            selectedKeys={normalizedSelectedExtras}
            selectionType="MULTI"
            onToggle={toggleExtra}
            disabledOptions={disabled}
            hiddenOptions={hidden}
            isCompany={isCompany}
            emptyLabel="Geen verwarmings-extra&apos;s beschikbaar."
          />
        </div>
      )}
    </SectionWrapper>
  );
};

export default HeatingSection;
