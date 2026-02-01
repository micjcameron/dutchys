'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getDisplayPrice } from '@/components/configurator/utils/pricing';
import SectionWrapper from './SectionWrapper';
import type { BaseProduct } from '@/types/catalog';

interface BaseSectionProps {
  title: string;
  description?: string;
  products: BaseProduct[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAutoAdvance?: () => void;
  isCompany: boolean;

  // ✅ FE-only gate (tooltip warning lives in parent)
  setSectionGate?: (gate: { isValid: boolean; warning?: string | null }) => void;
}

const BaseSection = ({
  title,
  description,
  products,
  selectedId,
  onSelect,
  onAutoAdvance,
  isCompany,
  setSectionGate,
}: BaseSectionProps) => {
  // ✅ Valid iff a base product is selected
  useEffect(() => {
    setSectionGate?.({
      isValid: Boolean(selectedId),
      warning: selectedId ? null : 'Kies een model om door te gaan.',
    });
  }, [selectedId, setSectionGate]);

  return (
    <SectionWrapper title={title} description={description}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(products ?? []).map((product) => {
          const priceIncl = product.basePriceIncl ?? product.basePriceExcl;
          const displayPrice = getDisplayPrice(
            { priceExcl: product.basePriceExcl, priceIncl },
            isCompany,
          );

          const isSelected = selectedId === product.id;

          return (
            <Card
              key={product.id}
              className={`cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-brand-orange bg-brand-orange/5' : 'hover:shadow-md'
              }`}
              onClick={() => {
                if (isSelected) return;
                onSelect(product.id);
                onAutoAdvance?.();
              }}
            >
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                <div className="text-xs text-gray-400 mb-3">
                  {product.attributes?.size ? `Formaat: ${product.attributes.size}` : 'Maatwerk'}
                </div>

                <div className="text-sm font-semibold text-brand-orange">
                  €{formatCurrency(displayPrice)}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default BaseSection;
