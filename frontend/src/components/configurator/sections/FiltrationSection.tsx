'use client';

import React, { useEffect, useMemo, useCallback } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections } from '@/types/catalog';

interface FiltrationSectionProps {
  title: string;
  description?: string;

  // ✅ One combined list: FILTER + CONNECTION + ADDONS + BOX
  options: CatalogOption[];

  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;

  evaluation?: any; // tolerated (disabled/hidden maps)
  isCompany: boolean;

  // ✅ FE gate for tooltip on Volgende button
  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

// -------------------------
// Seed keys (your implicit mode)
// -------------------------
const SAND_FILTER_KEY = 'SAND-FILTER';

// ✅ updated semantics
// - NO_FILTRATION: no filter at all, no connections
// - OWN_FILTER: user will organise their own external filter (connections optional)
const NO_FILTRATION_KEY = 'NO-FILTRATION';
const OWN_FILTER_KEY = 'OWN-FILTER';

// Backwards-compatible fallbacks (if old keys still exist in data)
const LEGACY_NO_FILTER_NO_CONNECTIONS_KEY = 'NO-FILTER-SELECTED-NO-CONNECTIONS';
const LEGACY_NO_FILTER_CONNECTIONS_NEEDED_KEY = 'NO-FILTER-SELECTED-CONNECTIONS-NEEDED';

// Group keys (as per your catalog seed)
const GK_FILTER = 'FILTRATION_FILTER_BASE';
const GK_CONNECTION = 'FILTRATION_CONNECTOR_BASE';
const GK_ADDONS = 'FILTRATION_ADDONS';
const GK_BOX = 'FILTRATION_BOX';

const DEBUG = process.env.NODE_ENV !== 'production';
const upper = (v: unknown) => String(v ?? '').trim().toUpperCase();

const getSubBucket = (o: CatalogOption): string =>
  upper((o as any)?.subKey ?? (o as any)?.attributes?.subKey ?? (o as any)?.attributes?.type ?? '');

const isUvByHeuristic = (o: CatalogOption) => {
  const sb = getSubBucket(o);
  if (sb === 'UV') return true;
  return upper(o.key).includes('UV');
};

const FiltrationSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  evaluation,
  isCompany,
  setSectionGate,
}: FiltrationSectionProps) => {
  const disabledMap = evaluation?.disabledOptions ?? {};
  const hiddenMap = evaluation?.hiddenOptions ?? {};

  const isBlocked = useCallback(
    (key: string) => Boolean(disabledMap?.[key] || hiddenMap?.[key]),
    [disabledMap, hiddenMap],
  );

  // -------------------------
  // Split options into buckets (by groupKey FIRST)
  // -------------------------
  const filters = useMemo(() => {
    return (options ?? []).filter((o) => {
      if (hiddenMap?.[o.key]) return false;

      // Primary: groupKey
      if (upper(o.groupKey) === GK_FILTER) return true;

      // Fallback: subKey/type
      return getSubBucket(o) === 'FILTER';
    });
  }, [options, hiddenMap]);

  const connections = useMemo(() => {
    return (options ?? []).filter((o) => {
      if (hiddenMap?.[o.key]) return false;

      if (upper(o.groupKey) === GK_CONNECTION) return true;

      return getSubBucket(o) === 'CONNECTION';
    });
  }, [options, hiddenMap]);

  const uvOptions = useMemo(() => {
    return (options ?? []).filter((o) => {
      if (hiddenMap?.[o.key]) return false;

      // Primary: groupKey
      if (upper(o.groupKey) === GK_ADDONS) return isUvByHeuristic(o);

      // Fallback: allow UV by heuristic even if groupKey missing/messy
      return isUvByHeuristic(o);
    });
  }, [options, hiddenMap]);

  const boxOptions = useMemo(() => {
    return (options ?? []).filter((o) => {
      if (hiddenMap?.[o.key]) return false;

      if (upper(o.groupKey) === GK_BOX) return true;

      // Fallback: "requiresFilter" hint
      return Boolean((o.attributes as any)?.requiresFilter);
    });
  }, [options, hiddenMap]);

  // -------------------------
  // Current selections
  // -------------------------
  const selectedFilter = selections.filtration?.filterId ?? null;

  const selectedConnections = Array.isArray(selections.filtration?.connections)
    ? selections.filtration!.connections!
    : [];

  const selectedUv = Array.isArray(selections.filtration?.uv) ? selections.filtration!.uv! : [];
  const selectedFilterBox = selections.filtration?.filterBoxId ?? null;

  // -------------------------
  // Mode derived from filter key (implicit)
  // -------------------------
  const mode = useMemo(() => {
    if (!selectedFilter) return 'NONE_SELECTED' as const;

    if (selectedFilter === SAND_FILTER_KEY) return 'SAND_FILTER' as const;

    // ✅ new keys
    if (selectedFilter === NO_FILTRATION_KEY) return 'NO_FILTRATION' as const;
    if (selectedFilter === OWN_FILTER_KEY) return 'OWN_FILTER' as const;

    // ✅ legacy keys (backwards compatibility)
    if (selectedFilter === LEGACY_NO_FILTER_NO_CONNECTIONS_KEY) return 'NO_FILTRATION' as const;
    if (selectedFilter === LEGACY_NO_FILTER_CONNECTIONS_NEEDED_KEY) return 'OWN_FILTER' as const;

    // unknown-but-a-filter => treat as a real filter
    return 'OTHER_FILTER' as const;
  }, [selectedFilter]);

  // Desired behavior:
  // - Sand filter: connectors REQUIRED, UV optional, box shown
  // - Own filter: connectors OPTIONAL, UV optional, no box
  // - No filtration: nothing else shown/allowed
  const connectorsRequired = mode === 'SAND_FILTER' || mode === 'OTHER_FILTER';
  const showConnectors = mode !== 'NO_FILTRATION' && mode !== 'NONE_SELECTED';

  const uvEnabled = mode === 'SAND_FILTER' || mode === 'OWN_FILTER' || mode === 'OTHER_FILTER';

  const showFilterBoxes = mode === 'SAND_FILTER';
  const showUv = uvEnabled;

  // -------------------------
  // Gate (tooltip warning)
  // -------------------------
  const isValid = useMemo(() => {
    if (!selectedFilter) return false;
    if (connectorsRequired) return selectedConnections.length === 1;
    return true;
  }, [selectedFilter, connectorsRequired, selectedConnections.length]);

  const warning = useMemo(() => {
    if (!selectedFilter) return 'Kies eerst een filter-optie om door te gaan.';
    if (connectorsRequired && selectedConnections.length !== 1) {
      return 'Kies één set verbindingen (SF of RVS SF) om door te gaan.';
    }
    return null;
  }, [selectedFilter, connectorsRequired, selectedConnections.length]);

  useEffect(() => {
    setSectionGate?.({ isValid, warning });
  }, [isValid, warning, setSectionGate]);

  // -------------------------
  // Auto cleanup when mode changes / constraints apply
  // -------------------------
  useEffect(() => {
    // NO FILTRATION => wipe everything else
    if (mode === 'NO_FILTRATION') {
      if (selectedConnections.length || selectedUv.length || selectedFilterBox) {
        onSelectionsChange((prev) => ({
          ...prev,
          filtration: {
            ...(prev.filtration ?? {}),
            connections: [],
            uv: [],
            filterBoxId: null,
          },
        }));
      }
      return;
    }

    // If UV not enabled => clear
    if (!uvEnabled && selectedUv.length > 0) {
      onSelectionsChange((prev) => ({
        ...prev,
        filtration: {
          ...(prev.filtration ?? {}),
          uv: [],
        },
      }));
    }

    // If not sand filter => clear box
    if (!showFilterBoxes && selectedFilterBox) {
      onSelectionsChange((prev) => ({
        ...prev,
        filtration: {
          ...(prev.filtration ?? {}),
          filterBoxId: null,
        },
      }));
    }

    // Drop blocked connections
    if (selectedConnections.length > 0) {
      const allowed = selectedConnections.filter((k) => !isBlocked(k));
      if (allowed.length !== selectedConnections.length) {
        onSelectionsChange((prev) => ({
          ...prev,
          filtration: {
            ...(prev.filtration ?? {}),
            connections: allowed,
          },
        }));
      }
    }

    // Drop blocked UV
    if (selectedUv.length > 0) {
      const allowedUv = selectedUv.filter((k) => !isBlocked(k));
      if (allowedUv.length !== selectedUv.length) {
        onSelectionsChange((prev) => ({
          ...prev,
          filtration: {
            ...(prev.filtration ?? {}),
            uv: allowedUv,
          },
        }));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mode,
    uvEnabled,
    showFilterBoxes,
    selectedFilterBox,
    selectedConnections.join('|'),
    selectedUv.join('|'),
  ]);

  // -------------------------
  // Actions
  // -------------------------
  const toggleFilter = (key: string) => {
    if (isBlocked(key)) return;

    onSelectionsChange((prev) => {
      const isDeselecting = prev.filtration?.filterId === key;
      const nextFilterId = isDeselecting ? null : key;

      return {
        ...prev,
        filtration: {
          ...(prev.filtration ?? {}),
          filterId: nextFilterId,
          filterBoxId: null, // always clear on filter change
        },
      };
    });
  };

  const toggleConnection = (key: string) => {
    if (isBlocked(key)) return;
    if (!showConnectors) return;

    onSelectionsChange((prev) => {
      const current = prev.filtration?.connections ?? [];
      const already = current.includes(key);
      const next = already ? [] : [key]; // SINGLE

      return {
        ...prev,
        filtration: {
          ...(prev.filtration ?? {}),
          connections: next,
        },
      };
    });
  };

  const toggleUv = (key: string) => {
    if (isBlocked(key)) return;
    if (!uvEnabled) return;

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
    if (!showFilterBoxes) return;

    onSelectionsChange((prev) => ({
      ...prev,
      filtration: {
        ...(prev.filtration ?? {}),
        filterBoxId: prev.filtration?.filterBoxId === key ? null : key,
      },
    }));
  };

  // Helpful copy (not gating)
  const showConnectorsHint = mode === 'OWN_FILTER' && selectedConnections.length === 0;

  if (DEBUG) {
    console.groupCollapsed('[FILTRATION] render');
    console.log('options.length:', options?.length ?? 0);
    console.log('bucket counts:', {
      filters: filters.length,
      connections: connections.length,
      uv: uvOptions.length,
      boxes: boxOptions.length,
    });
    console.log('selected:', { selectedFilter, selectedConnections, selectedUv, selectedFilterBox });
    console.log('mode:', mode);
    console.log('connectorsRequired:', connectorsRequired, 'showConnectors:', showConnectors);
    console.log('uvEnabled:', uvEnabled, 'showFilterBoxes:', showFilterBoxes);
    console.log('isValid:', isValid, 'warning:', warning);
    console.groupEnd();
  }

  return (
    <SectionWrapper title={title} description={description}>
      <div className="space-y-6">
        {/* 1) FILTER */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-brand-blue">Filter</h3>
          <OptionGrid
            options={filters}
            selectedKeys={selectedFilter ? [selectedFilter] : []}
            selectionType="SINGLE"
            onToggle={toggleFilter}
            disabledOptions={disabledMap}
            hiddenOptions={hiddenMap}
            isCompany={isCompany}
            emptyLabel="Geen filters beschikbaar."
          />
        </div>

        {/* 2) CONNECTIONS */}
        {showConnectors && (
          <div className="space-y-3">
            <div className="flex items-end justify-between gap-4">
              <h3 className="text-lg font-semibold text-brand-blue">Verbindingen</h3>
              {connectorsRequired && <div className="text-xs text-gray-500">Vereist</div>}
            </div>

            <OptionGrid
              options={connections}
              selectedKeys={selectedConnections}
              selectionType="SINGLE"
              onToggle={toggleConnection}
              disabledOptions={disabledMap}
              hiddenOptions={hiddenMap}
              isCompany={isCompany}
              emptyLabel="Geen verbindingen beschikbaar."
            />

            {showConnectorsHint && (
              <div className="text-sm text-gray-600">
                Je kiest “Eigen filter”. Als je een extern filter gebruikt, zijn verbindingen vaak
                nodig. Kies SF of RVS SF als je wilt dat wij ze meeleveren.
              </div>
            )}
          </div>
        )}

        {/* 3) FILTER BOX (sand filter only) */}
        {showFilterBoxes && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-brand-blue">Filterbox</h3>
            <OptionGrid
              options={boxOptions}
              selectedKeys={selectedFilterBox ? [selectedFilterBox] : []}
              selectionType="SINGLE"
              onToggle={toggleFilterBox}
              disabledOptions={disabledMap}
              hiddenOptions={hiddenMap}
              isCompany={isCompany}
              emptyLabel="Geen filterboxen beschikbaar."
            />
          </div>
        )}

        {/* 4) UV */}
        {showUv && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-brand-blue">UV</h3>
            <OptionGrid
              options={uvOptions}
              selectedKeys={selectedUv}
              selectionType="MULTI"
              onToggle={toggleUv}
              disabledOptions={disabledMap}
              hiddenOptions={hiddenMap}
              isCompany={isCompany}
              emptyLabel="Geen UV-opties beschikbaar."
            />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default FiltrationSection;
