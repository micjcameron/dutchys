'use client';

import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections } from '@/types/catalog';

interface StairsSectionProps {
  title: string;
  description?: string;

  // Must include STAIRS_BASE + STAIRS_COVER_FILTER + FILTRATION_BOX (or provide getOption)
  options: CatalogOption[];
  getOption?: (key: string) => CatalogOption | undefined;

  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;

  evaluation?: any;
  isCompany: boolean;

  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;

  // ProductConfigurator runs commit on Next
  registerStepCommit?: (fn: ((prev: ConfigSelections) => ConfigSelections) | null) => void;
}

const DEBUG = process.env.NODE_ENV !== 'production';
const upper = (v: unknown) => String(v ?? '').trim().toUpperCase();

const GK_STAIRS = 'STAIRS_BASE';
const GK_COVER_FILTER = 'STAIRS_COVER_FILTER';

const COVER_FILTER_YES_KEY = 'STAIRS-COVER-FILTER-YES';
const COVER_FILTER_NO_KEY = 'STAIRS-COVER-FILTER-NO';

// Must match FiltrationSection
const SAND_FILTER_KEY = 'SAND-FILTER';

// pick your actual included/default stairs key (from seed)
const DEFAULT_STAIRS_KEY = 'STANDARD-STAIRS';

type CoverIntent = 'YES' | 'NO' | null;

const getPrice = (o: CatalogOption | null | undefined, isCompany: boolean) => {
  if (!o) return 0;
  const v = isCompany ? (o.priceExcl ?? 0) : (o.priceIncl ?? 0);
  return typeof v === 'number' ? v : 0;
};

const euro = (n: number) => `€${n.toFixed(2).replace('.', ',')}`;

const StairsSection = ({
  title,
  description,
  options,
  getOption,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
  setSectionGate,
  registerStepCommit,
}: StairsSectionProps) => {
  const disabledMap = evaluation?.disabledOptions ?? {};
  const hiddenMap = evaluation?.hiddenOptions ?? {};

  const isBlocked = useCallback(
    (key: string) => Boolean(disabledMap?.[key] || hiddenMap?.[key]),
    [disabledMap, hiddenMap],
  );

  // -------------------------
  // Split options by groupKey
  // -------------------------
  const stairsOptions = useMemo(
    () => (options ?? []).filter((o) => upper(o.groupKey) === GK_STAIRS && !hiddenMap?.[o.key]),
    [options, hiddenMap],
  );

  const coverFilterOptions = useMemo(
    () => (options ?? []).filter((o) => upper(o.groupKey) === GK_COVER_FILTER && !hiddenMap?.[o.key]),
    [options, hiddenMap],
  );

  const yesOptRaw = coverFilterOptions.find((o) => o.key === COVER_FILTER_YES_KEY) ?? null;
  const noOptRaw = coverFilterOptions.find((o) => o.key === COVER_FILTER_NO_KEY) ?? null;

  // -------------------------
  // Current selections
  // -------------------------
  const selectedStairKey = selections.stairs?.optionId ?? null;

  const selectedFilterId = selections.filtration?.filterId ?? null; // ✅ new
  const selectedFilterBoxId = selections.filtration?.filterBoxId ?? null;

  const coverFilterIntent = (((selections as any).stairs?.coverFilterIntent ?? null) as CoverIntent);

  const selectedStair = selectedStairKey ? stairsOptions.find((o) => o.key === selectedStairKey) : null;
  const stairCanCoverFilter = Boolean((selectedStair?.attributes as any)?.coversSandFilter);

  // ✅ only meaningful when a sand filter is actually selected
  const canMeaningfullyCoverSandFilter =
    stairCanCoverFilter && selectedFilterId === SAND_FILTER_KEY;

  // -------------------------
  // Filterbox price (savings)
  // -------------------------
  const selectedFilterBoxOpt = useMemo(() => {
    if (!selectedFilterBoxId) return null;
    return (
      getOption?.(selectedFilterBoxId) ??
      (options ?? []).find((o) => o.key === selectedFilterBoxId) ??
      null
    );
  }, [getOption, options, selectedFilterBoxId]);

  const selectedFilterBoxPrice = useMemo(
    () => getPrice(selectedFilterBoxOpt, isCompany),
    [selectedFilterBoxOpt, isCompany],
  );

  // -------------------------
  // Default stairs selection (like Lid)
  // -------------------------
  const defaultStairKey = useMemo(() => {
    const included = stairsOptions.find((o) => Boolean((o as any)?.included));
    if (included && !isBlocked(included.key)) return included.key;

    const hasDefault = stairsOptions.some((o) => o.key === DEFAULT_STAIRS_KEY);
    if (hasDefault && !isBlocked(DEFAULT_STAIRS_KEY)) return DEFAULT_STAIRS_KEY;

    const first = stairsOptions.find((o) => !isBlocked(o.key));
    return first?.key ?? null;
  }, [stairsOptions, isBlocked]);

  useEffect(() => {
    if (selectedStairKey && !isBlocked(selectedStairKey)) return;
    if (!defaultStairKey) return;

    if (DEBUG) console.log('[stairs] enforce default', { selectedStairKey, defaultStairKey });

    onSelectionsChange((prev) => ({
      ...prev,
      stairs: {
        ...(prev.stairs ?? {}),
        optionId: defaultStairKey,
      } as any,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStairKey, defaultStairKey, stairsOptions.length]);

  // -------------------------
  // Gate
  // -------------------------
  useEffect(() => {
    const hasAny = Boolean(selectedStairKey || defaultStairKey);
    setSectionGate?.({
      isValid: hasAny,
      warning: hasAny ? null : 'Kies een trap om door te gaan.',
    });
  }, [selectedStairKey, defaultStairKey, setSectionGate]);

  // -------------------------
  // Optional: clear irrelevant intent when not in sand-filter mode
  // -------------------------
  useEffect(() => {
    if (selectedFilterId === SAND_FILTER_KEY) return;
    if (coverFilterIntent == null) return;

    onSelectionsChange((prev) => ({
      ...prev,
      stairs: {
        ...(prev.stairs ?? {}),
        coverFilterIntent: null,
      } as any,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilterId]);

  // -------------------------
  // Commit-on-next
  // -------------------------
  useEffect(() => {
    if (!registerStepCommit) return;

    const commit = (prev: ConfigSelections): ConfigSelections => {
      const stairKey = prev.stairs?.optionId ?? null;
      const filterBoxId = prev.filtration?.filterBoxId ?? null;
      const filterId = prev.filtration?.filterId ?? null; // ✅ new
      const intent = (((prev as any).stairs?.coverFilterIntent ?? null) as CoverIntent);

      if (!stairKey) return prev;

      const stairOpt =
        getOption?.(stairKey) ??
        (options ?? []).find((o) => o.key === stairKey) ??
        null;

      const canCover = Boolean((stairOpt?.attributes as any)?.coversSandFilter);

      // ✅ only apply cross-step effect when sand filter is actually selected
      const meaningful = canCover && filterId === SAND_FILTER_KEY;

      if (DEBUG) {
        console.groupCollapsed('[STAIRS commit]');
        console.log('before', { stairKey, canCover, filterId, meaningful, intent, filterBoxId });
      }

      if (meaningful && intent === 'YES' && filterBoxId) {
        const next = {
          ...prev,
          filtration: {
            ...(prev.filtration ?? {}),
            filterBoxId: null,
          },
        };

        if (DEBUG) {
          console.log('after CLEARED filterBoxId', { from: filterBoxId });
          console.groupEnd();
        }
        return next;
      }

      if (DEBUG) {
        console.log('after no-op');
        console.groupEnd();
      }
      return prev;
    };

    registerStepCommit(commit);
    return () => registerStepCommit(null);
  }, [registerStepCommit, options, getOption]);

  // -------------------------
  // Conflict warning nuance (don’t pop instantly on first click)
  // -------------------------
  const prevIntentRef = useRef<CoverIntent>(null);
  useEffect(() => {
    prevIntentRef.current = coverFilterIntent;
  }, [coverFilterIntent]);

  const conflictExists =
    canMeaningfullyCoverSandFilter &&
    coverFilterIntent === 'YES' &&
    Boolean(selectedFilterBoxId);

  const shouldShowConflictWarning = useMemo(() => {
    if (!conflictExists) return false;
    return prevIntentRef.current === 'YES';
  }, [conflictExists]);

  const warningText = useMemo(() => {
    if (!shouldShowConflictWarning) return null;

    return (
      'Je hebt gekozen om de zandfilter onder de trap te plaatsen, terwijl er ook een filterbox is geselecteerd. ' +
      'Als je doorgaat, verwijderen we automatisch de filterbox. ' +
      'Wil je liever een aparte filterbox gebruiken? Kies dan “Nee, niet onder de trap” bij deze stap.'
    );
  }, [shouldShowConflictWarning]);

  // -------------------------
  // Build YES/NO options with savings injected into YES
  // (only relevant when sand filter mode is active)
  // -------------------------
  const coverChoiceOptions = useMemo(() => {
    if (!yesOptRaw || !noOptRaw) return [];
    if (!canMeaningfullyCoverSandFilter) return [];

    const hasSelectedBox = Boolean(selectedFilterBoxId);
    const boxPrice = selectedFilterBoxPrice > 0 ? selectedFilterBoxPrice : 0;

    const yesBaseName = yesOptRaw.name?.trim() || 'Ja, onder de trap';
    const noBaseName = noOptRaw.name?.trim() || 'Nee, aparte filterbox';

    const canShowSavings = hasSelectedBox && boxPrice > 0;

    const yesName = canShowSavings ? `${yesBaseName} (bespaart ${euro(boxPrice)})` : yesBaseName;

    const yesPriceDelta = canShowSavings ? -boxPrice : (getPrice(yesOptRaw, isCompany) || 0);

    const yesMutated: CatalogOption = {
      ...yesOptRaw,
      name: yesName,
      description: canShowSavings
        ? `${(yesOptRaw.description ?? 'Plaats de zandfilter onder de trap.')} (Filterbox wordt verwijderd bij “Volgende”.)`
        : (yesOptRaw.description ?? 'Plaats de zandfilter onder de trap.'),
      // Force the card price to show as a negative saving
      priceIncl: isCompany ? yesOptRaw.priceIncl : yesPriceDelta,
      priceExcl: isCompany ? yesPriceDelta : yesOptRaw.priceExcl,
    };

    const noMutated: CatalogOption = {
      ...noOptRaw,
      name: noBaseName,
    };

    return [yesMutated, noMutated];
  }, [
    yesOptRaw,
    noOptRaw,
    canMeaningfullyCoverSandFilter,
    selectedFilterBoxId,
    selectedFilterBoxPrice,
    isCompany,
  ]);

  // -------------------------
  // Actions
  // -------------------------
  const toggleStair = (key: string) => {
    if (isBlocked(key)) return;

    onSelectionsChange((prev) => {
      const current = prev.stairs?.optionId ?? null;

      // clicking same stair should not clear it
      if (current === key) {
        return {
          ...prev,
          stairs: {
            ...(prev.stairs ?? {}),
            optionId: defaultStairKey ?? current,
          } as any,
        };
      }

      return {
        ...prev,
        stairs: {
          ...(prev.stairs ?? {}),
          optionId: key,
        } as any,
      };
    });
  };

  const toggleCoverFilter = (key: string) => {
    if (!canMeaningfullyCoverSandFilter) return;
    if (isBlocked(key)) return;

    const nextIntent: CoverIntent =
      key === COVER_FILTER_YES_KEY ? 'YES' : key === COVER_FILTER_NO_KEY ? 'NO' : null;

    onSelectionsChange((prev) => {
      const currentIntent = (((prev as any).stairs?.coverFilterIntent ?? null) as CoverIntent);
      const resolved = currentIntent === nextIntent ? currentIntent : nextIntent;

      if (DEBUG) {
        console.log('[stairs] toggleCoverFilter', {
          key,
          currentIntent,
          nextIntent,
          resolved,
          filterId_now: prev.filtration?.filterId ?? null,
          filterBoxId_now: prev.filtration?.filterBoxId ?? null,
          filterBoxPrice_now: selectedFilterBoxPrice,
        });
      }

      return {
        ...prev,
        stairs: {
          ...(prev.stairs ?? {}),
          coverFilterIntent: resolved ?? nextIntent ?? 'NO',
        } as any,
      };
    });
  };

  const selectedCoverKey =
    coverFilterIntent === 'YES'
      ? COVER_FILTER_YES_KEY
      : coverFilterIntent === 'NO'
        ? COVER_FILTER_NO_KEY
        : null;

  if (DEBUG) {
    console.groupCollapsed('[stairs] render');
    console.log('selectedStairKey', selectedStairKey, 'defaultStairKey', defaultStairKey);
    console.log('selectedFilterId', selectedFilterId, 'sandKey', SAND_FILTER_KEY);
    console.log('stairCanCoverFilter', stairCanCoverFilter, 'canMeaningfullyCoverSandFilter', canMeaningfullyCoverSandFilter);
    console.log('coverFilterIntent', coverFilterIntent, 'selectedCoverKey', selectedCoverKey);
    console.log('selectedFilterBoxId', selectedFilterBoxId);
    console.log('selectedFilterBoxOpt', selectedFilterBoxOpt);
    console.log('selectedFilterBoxPrice', selectedFilterBoxPrice);
    console.log('coverChoiceOptions', coverChoiceOptions.map((o) => ({ key: o.key, name: o.name })));
    console.groupEnd();
  }

  return (
    <SectionWrapper title={title} description={description}>
      <div className="space-y-6">
        <OptionGrid
          options={stairsOptions}
          selectedKeys={selectedStairKey ? [selectedStairKey] : defaultStairKey ? [defaultStairKey] : []}
          selectionType="SINGLE"
          onToggle={toggleStair}
          disabledOptions={disabledMap}
          hiddenOptions={hiddenMap}
          isCompany={isCompany}
          emptyLabel="Geen trap-opties beschikbaar."
        />

        {canMeaningfullyCoverSandFilter && (
          <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
            ✔ Deze trap kan de zandfilter afdekken (optioneel onder de trap te plaatsen).
          </div>
        )}

        {warningText && (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            {warningText}
          </div>
        )}

        {canMeaningfullyCoverSandFilter && coverChoiceOptions.length === 2 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-brand-blue">Zandfilter onder trap?</h3>

            <OptionGrid
              options={coverChoiceOptions}
              selectedKeys={selectedCoverKey ? [selectedCoverKey] : []}
              selectionType="SINGLE"
              onToggle={toggleCoverFilter}
              disabledOptions={disabledMap}
              hiddenOptions={hiddenMap}
              isCompany={isCompany}
              emptyLabel="Geen opties beschikbaar."
            />

            <div className="text-sm text-gray-600">
              Kies <b>Ja</b> als je de filterbox niet wilt gebruiken en de zandfilter onder de XL-trap geplaatst moet worden.
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default StairsSection;
