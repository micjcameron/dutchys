'use client';

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
  isCompany: boolean;
}

const BaseSection = ({ title, description, products, selectedId, onSelect, isCompany }: BaseSectionProps) => (
  <SectionWrapper title={title} description={description}>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {products.map((product) => {
        const priceIncl = product.basePriceExcl * (1 + (product.vatRatePercent ?? 21) / 100);
        const displayPrice = getDisplayPrice({ priceExcl: product.basePriceExcl, priceIncl }, isCompany);
        return (
          <Card
            key={product.id}
            className={`cursor-pointer transition-all ${selectedId === product.id ? 'ring-2 ring-brand-orange bg-brand-orange/5' : 'hover:shadow-md'}`}
            onClick={() => onSelect(product.id)}
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

export default BaseSection;
