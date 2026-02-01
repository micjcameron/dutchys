'use client';

import React, { useEffect, useMemo } from 'react';
import SectionWrapper from './SectionWrapper';
import OptionGrid from './OptionGrid';
import type { CatalogOption, ConfigSelections } from '@/types/catalog';

interface LidSectionProps {
  title: string;
  description?: string;
  options: CatalogOption[];
  selections: ConfigSelections;
  onSelectionsChange: (update: (prev: ConfigSelections) => ConfigSelections) => void;
  onAutoAdvance?: () => void;
  evaluation?: any;
  isCompany: boolean;

  // ✅ FE-only gate (tooltip warning lives in parent)
  // LID should always end up with a default, so this is always valid.
  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

const DEBUG = process.env.NODE_ENV !== 'production';

// ✅ choose your real key
const STANDARD_LID_KEY = 'LID-STANDARD'; // <-- change to your actual STANDARD lid option key

const LidSection = ({
  title,
  description,
  options,
  selections,
  onSelectionsChange,
  onAutoAdvance,
  evaluation,
  isCompany,
  setSectionGate,
}: LidSectionProps) => {
  const selected = selections.lid?.optionId ?? null;

  const hidden = evaluation?.hiddenOptions ?? {};
  const disabled = evaluation?.disabledOptions ?? {};

  const isBlocked = (key: string) => Boolean(hidden?.[key] || disabled?.[key]);

  const visibleEnabledOptions = useMemo(
    () => (options ?? []).filter((o) => !isBlocked(o.key)),
    [options, hidden, disabled],
  );

  const defaultKey = useMemo(() => {
    // Prefer STANDARD if it exists and isn't blocked
    const hasStandard = (options ?? []).some((o) => o.key === STANDARD_LID_KEY);
    if (hasStandard && !isBlocked(STANDARD_LID_KEY)) return STANDARD_LID_KEY;

    // fallback: first visible+enabled option
    return visibleEnabledOptions[0]?.key ?? null;
  }, [options, visibleEnabledOptions, hidden, disabled]);

  // ✅ gate: LID always valid (we force a default when possible)
  useEffect(() => {
    setSectionGate?.({ isValid: true, warning: null });
  }, [setSectionGate]);

  // ✅ Auto-select default on load / whenever constraints change and current selection becomes invalid
  useEffect(() => {
    // if already selected and still valid, do nothing
    if (selected && !isBlocked(selected)) return;

    // if nothing selected OR selected became blocked -> set default
    if (!defaultKey) return; // nothing available
    onSelectionsChange((prev) => ({
      ...prev,
      lid: {
        ...(prev.lid ?? {}),
        optionId: defaultKey,
      },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, defaultKey, hidden, disabled]);

  const toggle = (key: string) => {
    if (isBlocked(key)) return;

    const isSelecting = selected !== key;

    onSelectionsChange((prev) => {
      const current = prev.lid?.optionId ?? null;

      // user clicked the same key => they are "deselecting"
      if (current === key) {
        // ✅ force fallback to STANDARD/default (never null)
        return {
          ...prev,
          lid: {
            ...(prev.lid ?? {}),
            optionId: defaultKey, // could be STANDARD or fallback
          },
        };
      }

      // switching to a different lid
      return {
        ...prev,
        lid: {
          ...(prev.lid ?? {}),
          optionId: key,
        },
      };
    });

    if (isSelecting) onAutoAdvance?.();
  };

  if (DEBUG) {
    console.groupCollapsed('[lid] render');
    console.log('selected:', selected);
    console.log('defaultKey:', defaultKey);
    console.log('blocked selected?', selected ? isBlocked(selected) : '(none)');
    console.log('options:', (options ?? []).map((o) => o.key));
    console.groupEnd();
  }

  return (
    <SectionWrapper title={title} description={description}>
      <OptionGrid
        options={options}
        selectedKeys={selected ? [selected] : defaultKey ? [defaultKey] : []}
        selectionType="SINGLE"
        onToggle={toggle}
        disabledOptions={disabled}
        hiddenOptions={hidden}
        isCompany={isCompany}
        emptyLabel="Geen deksel-opties beschikbaar."
      />
    </SectionWrapper>
  );
};

export default LidSection;
