'use client';

import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type {
  BaseProduct,
  CatalogOption,
  ConfigSelections,
  EvaluationResult,
  GetOption,
} from '@/types/catalog';

interface HeatingSectionProps {
  title: string;
  description?: string;
  product: BaseProduct | null;
  options: CatalogOption[]; // HEATING_BASE only
  extras: CatalogOption[]; // internal+external addon options (both groups)
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
  getOption: GetOption;
}

const HEATING_GROUP_KEY = 'HEATING_BASE';
const HEATER_ADDONS_INTERNAL = 'HEATER_ADDONS_INTERNAL';
const HEATER_ADDONS_EXTERNAL = 'HEATER_ADDONS_EXTERNAL';

type OptionConstraintMap = Record<string, { reason: string }>;
const DEBUG = process.env.NODE_ENV !== 'production';

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
  getOption,
}: HeatingSectionProps) => {
  const rawHeatingTypes = product?.heatingTypes;
  const heatingTypes = Array.isArray(rawHeatingTypes)
    ? rawHeatingTypes.map((type) => String(type).toUpperCase())
    : null;

  const allowsIntegratedHeater = product?.attributes?.allowsIntegratedHeater !== false;
  const allowsExternalHeater = product?.attributes?.allowsExternalHeater !== false;

  const disabled: OptionConstraintMap = evaluation?.disabledOptions ?? {};
  console.log("disabled")
  console.log(disabled)
  const hidden: OptionConstraintMap = evaluation?.hiddenOptions ?? {};
  console.log("hidden")
  console.log(hidden)
  const isDisabled = (key: string) => Boolean(disabled[key]);
  const isHidden = (key: string) => Boolean(hidden[key]);

  // -------------------------
  // Resolve installation type from GLOBAL optionMap
  // -------------------------
  const installKey = (selections.heaterInstallation?.optionId ?? null) as string | null;
  const installOption = installKey ? getOption(installKey) : undefined;
  const installTypeRaw = String(installOption?.attributes?.type ?? '').toUpperCase(); // EXTERNAL | INTEGRATED | ""
  const installType =
    installTypeRaw === 'EXTERNAL' || installTypeRaw === 'INTEGRATED' ? installTypeRaw : '';

  // -------------------------
  // Heating base options
  // -------------------------
  const baseHeatingOptions = options.filter((o) => o.groupKey === HEATING_GROUP_KEY);

  const heatingOptions =
    heatingTypes && heatingTypes.length > 0
      ? baseHeatingOptions
          // product type tags filter (your existing logic)
          .filter((option) =>
            option.tags?.some((tag) => heatingTypes.includes(String(tag).toUpperCase())),
          )
          // placement + capability + installType filter (FIX)
          .filter((option) => {
            const placementRaw = String(option.attributes?.placement ?? '').toUpperCase(); // INTEGRATED | EXTERNAL | ""
            const placement =
              placementRaw === 'EXTERNAL' || placementRaw === 'INTEGRATED' ? placementRaw : '';

            // capability guards
            if (!allowsIntegratedHeater && placement === 'INTEGRATED') return false;
            if (!allowsExternalHeater && placement === 'EXTERNAL') return false;

            // ✅ respect chosen install type (if selected)
            // If installType is empty (not chosen yet), allow both.
            if (installType === 'INTEGRATED' && placement === 'EXTERNAL') return false;
            if (installType === 'EXTERNAL' && placement === 'INTEGRATED') return false;

            return true;
          })
      : [];

  // -------------------------
  // Selections
  // -------------------------
  const selectedHeatingKey = (selections.heating?.optionId ?? null) as string | null;
  const selectedHeatingOption = selectedHeatingKey ? getOption(selectedHeatingKey) : undefined;

  const selectedExtras = Array.isArray(selections.heating?.extras) ? selections.heating!.extras! : [];

  const heatingPlacementRaw = String(selectedHeatingOption?.attributes?.placement ?? '').toUpperCase();
  const heatingPlacement =
    heatingPlacementRaw === 'EXTERNAL' || heatingPlacementRaw === 'INTEGRATED' ? heatingPlacementRaw : '';

  // effective placement: prefer heating placement; fallback to installType if heating doesn’t specify
  const effectivePlacement = heatingPlacement || installType || '';

  const allowedAddonGroupKey =
    effectivePlacement === 'EXTERNAL'
      ? HEATER_ADDONS_EXTERNAL
      : effectivePlacement === 'INTEGRATED'
        ? HEATER_ADDONS_INTERNAL
        : null;

  // Extra keys come from the selected HEATING option (truth source)
  const extraOptionKeys = Array.isArray(selectedHeatingOption?.attributes?.extraOptionKeys)
    ? (selectedHeatingOption?.attributes?.extraOptionKeys as string[]).filter(Boolean)
    : [];

  // ✅ SHOW EXTRAS ONLY WHEN A HEATING OPTION IS SELECTED
  // and only those extras that:
  // - match the addon group for placement
  // - are listed in the selected heating option’s extraOptionKeys
  const availableExtras =
    selectedHeatingKey && allowedAddonGroupKey
      ? extras
          .filter((o) => o.groupKey === allowedAddonGroupKey)
          .filter((o) => extraOptionKeys.includes(o.key))
      : [];

  // ✅ If heating changes and existing extras are no longer valid, trim them
  const normalizedSelectedExtras = selectedExtras.filter((k) => availableExtras.some((o) => o.key === k));

  // -------------------------
  // Actions
  // -------------------------
  const toggleHeating = (key: string) => {
    if (DEBUG) {
      console.groupCollapsed('[HEATING] toggleHeating', key);
      console.log('before selections.heating:', selections.heating);
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

      // Always clear extras when heating changes (prevents cross-placement leakage)
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

    // only allow toggling extras that are currently available
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

  // If we detect stale extras in state, auto-trim them once (non-destructive)
  // This prevents “extras come back disabled / weird” when backend lags.
  if (selectedHeatingKey && normalizedSelectedExtras.length !== selectedExtras.length) {
    onSelectionsChange((prev) => ({
      ...prev,
      heating: {
        ...(prev.heating ?? {}),
        extras: normalizedSelectedExtras,
      },
    }));
  }

  if (DEBUG) {
    console.groupCollapsed('[HEATING] render');
    console.log('productKey:', (product as any)?.attributes?.productKey ?? (product as any)?.slug ?? '(null)');
    console.log('rawHeatingTypes:', rawHeatingTypes);
    console.log('heatingTypes:', heatingTypes);
    console.log('allowsIntegratedHeater:', allowsIntegratedHeater, 'allowsExternalHeater:', allowsExternalHeater);

    console.log('installKey:', installKey);
    console.log('installType:', installType);

    console.log('selectedHeatingKey:', selectedHeatingKey);
    console.log('heatingPlacement:', heatingPlacement);
    console.log('effectivePlacement:', effectivePlacement);
    console.log('allowedAddonGroupKey:', allowedAddonGroupKey);

    console.log('heatingOptions count:', heatingOptions.length);
    console.log(
      'heatingOptions placements:',
      heatingOptions.map((o) => [o.key, String(o.attributes?.placement ?? '').toUpperCase()]),
    );

    console.log('extras incoming:', extras.length);
    console.log('extraOptionKeys:', extraOptionKeys);
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

      {/* ✅ show extras only when a heating option is selected */}
      {selectedHeatingKey && availableExtras.length > 0 && (
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
