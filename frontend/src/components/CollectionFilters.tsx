'use client';

import React from 'react';
import { Users, Ruler, RotateCcw } from 'lucide-react';

const FILTERS = [
  {
    key: 'personen',
    label: 'Aantal personen',
    icon: <Users className="w-3.5 h-3.5 mr-1 text-brand-blue" />,
    options: ['1-2', '2-4', '4-6', '6-8'],
    grid: 'grid-cols-2',
  },
  {
    key: 'formaat',
    label: 'Formaat',
    icon: null, // Per optie bepaald
    options: ['200cm ø', '225cm ø', '240cm ø', '180x180cm', '200x200cm', '220x220cm', '245x245cm', '120x190cm'],
    grid: 'grid-cols-2',
  },
  {
    key: 'vorm',
    label: 'Vorm',
    icon: null, // Per optie bepaald
    options: ['rond', 'vierkant', 'ofuro'],
    grid: 'grid-cols-3',
  },
];

interface CollectionFiltersProps {
  filters: {
    personen: string[];
    formaat: string[];
    vorm: string[];
  };
  onFiltersChange?: (filters: {
    personen: string[];
    formaat: string[];
    vorm: string[];
  }) => void;
}

export default function CollectionFilters({ filters, onFiltersChange }: CollectionFiltersProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function toggleFilter(group: keyof typeof filters, option: string) {
    const arr = filters[group];
    const newSelected = {
      ...filters,
      [group]: arr.includes(option)
        ? arr.filter(v => v !== option)
        : [...arr, option],
    };
    onFiltersChange?.(newSelected);
  }

  function resetFilters() {
    const newSelected = { personen: [], formaat: [], vorm: [] };
    onFiltersChange?.(newSelected);
  }

  function getPill({ group, option }: { group: string; option: string }) {
    const isSelected = filters[group as keyof typeof filters].includes(option);
    let icon = null;
    let label = option;
    let pillClass = "inline-flex items-center px-3 py-1 rounded-full border text-xs font-inter font-medium whitespace-nowrap transition-colors duration-150";
    if (isSelected) {
      pillClass += " bg-brand-orange text-white border-brand-orange shadow";
    } else {
      pillClass += " bg-gray-50 text-brand-blue border-gray-200 hover:bg-brand-blue/10";
    }
    if (group === 'vorm') {
      icon = null;
    } else if (group === 'personen') {
      icon = <Users className={`w-4 h-4 mr-1 ${isSelected ? 'text-white' : 'text-brand-blue'}`} />;
    } else if (group === 'formaat') {
      if (option.trim().endsWith('ø')) {
        icon = null;
        label = option;
      } else {
        icon = <Ruler className={`w-4 h-4 mr-1 ${isSelected ? 'text-white' : 'text-brand-blue'}`} />;
      }
    }
    return (
      <button
        key={group + '-' + option}
        className={pillClass}
        onClick={() => toggleFilter(group as keyof typeof filters, option)}
        type="button"
      >
        {icon}{label}
      </button>
    );
  }

  function renderFilterGroups() {
    return FILTERS.map(group => (
      <div key={group.key} className="mb-4">
        <span className="block text-sm font-bold text-brand-blue/80 mb-2">{group.label}</span>
        <div className="flex flex-wrap gap-2">
          {group.options.map(option => getPill({ group: group.key, option }))}
        </div>
      </div>
    ));
  }

  return (
    <>
      {/* Desktop: just the filter groups, no card/box or title */}
      <div className="hidden lg:block w-full">
        {renderFilterGroups()}
      </div>
      {/* Mobile dropdown: keep as is for now, since mobile needs a dropdown */}
      <div className="block lg:hidden w-full mb-6">
        <button
          className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-brand-blue font-semibold text-sm flex items-center justify-between shadow-sm"
          onClick={() => setMobileOpen(v => !v)}
        >
          Filters
          <svg className={`ml-2 w-4 h-4 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {mobileOpen && (
          <div className="mt-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-4">
            <div className="flex items-center justify-end mb-4">
              <button onClick={resetFilters} className="text-xs text-brand-blue/60 hover:text-brand-orange flex items-center gap-1" type="button">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>
            {renderFilterGroups()}
          </div>
        )}
      </div>
    </>
  );
}
