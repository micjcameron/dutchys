'use client';

import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImagePreview from '@/components/configurator/components/ImagePreview';
import { formatCurrency, getDisplayPrice } from '@/components/configurator/utils/pricing';
import type { CatalogOption } from '@/types/catalog';

export type OptionGridProps = {
  options: CatalogOption[];
  selectedKeys: string[];
  selectionType: 'single' | 'multi';
  onToggle: (key: string) => void;
  disabledOptions?: Record<string, { reason: string }>;
  hiddenOptions?: Record<string, { reason: string }>;
  isCompany: boolean;
  emptyLabel?: string;
};

const OptionGrid = ({
  options,
  selectedKeys,
  selectionType,
  onToggle,
  disabledOptions = {},
  hiddenOptions = {},
  isCompany,
  emptyLabel,
}: OptionGridProps) => {
  const visibleOptions = options.filter((option) => !hiddenOptions?.[option.key]);

  const formatValue = (value: string) => {
    const isAllCaps = /^[A-Z0-9_-]+$/.test(value);
    if (!isAllCaps) {
      return value;
    }
    return value
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (visibleOptions.length === 0) {
    return <div className="text-sm text-gray-500">{emptyLabel ?? 'Geen opties beschikbaar.'}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {visibleOptions.map((option) => {
        const isSelected = selectedKeys.includes(option.key);
        const disabledReason = disabledOptions?.[option.key]?.reason;
        const priceIncl = option.priceExcl * (1 + option.vatRate);
        const displayPrice = getDisplayPrice({ priceExcl: option.priceExcl, priceIncl }, isCompany);
        const imageSrc = option.attributes?.image as string | undefined;
        const power = option.attributes?.power as string | undefined;
        const voltage = option.attributes?.voltage as string | undefined;
        const type = option.attributes?.type as string | undefined;
        const wifi = option.attributes?.wifi as boolean | undefined;

        return (
          <Card
            key={option.key}
            className={`transition-all ${disabledReason ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'} ${isSelected ? 'ring-2 ring-brand-orange bg-brand-orange/5' : ''}`}
            onClick={() => {
              if (disabledReason) {
                return;
              }
              onToggle(option.key);
            }}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span>{option.name}</span>
                {isSelected && <Check className="h-4 w-4 text-brand-orange" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                {imageSrc && (
                  <ImagePreview src={imageSrc} alt={option.name} className="h-16 w-20" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                  {type && <p className="text-xs text-gray-500">Type: {formatValue(type)}</p>}
                  {power && <p className="text-xs text-gray-500">Vermogen: {power}</p>}
                  {voltage && <p className="text-xs text-gray-500">Voltage: {voltage}</p>}
                  {wifi !== undefined && (
                    <p className="text-xs text-gray-500">Wifi: {wifi ? 'Ja' : 'Nee'}</p>
                  )}
                  {disabledReason && (
                    <p className="text-xs text-red-500 mt-2">{disabledReason}</p>
                  )}
                </div>
              </div>
              <div className="text-sm font-semibold text-brand-orange mt-3">
                €{formatCurrency(displayPrice)}
              </div>
              {selectionType === 'multi' && (
                <div className="text-xs text-gray-400 mt-1">Meerdere opties mogelijk</div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OptionGrid;
