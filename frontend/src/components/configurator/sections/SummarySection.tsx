'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SectionWrapper from './SectionWrapper';
import { formatCurrency } from '@/components/configurator/utils/pricing';
import type { EvaluationResult } from '@/types/catalog';

interface SummarySectionProps {
  title: string;
  description?: string;
  evaluation: EvaluationResult | null;
  isCompany: boolean;
  onAddToCart: () => void;
  isDisabled?: boolean;
}

const SummarySection = ({
  title,
  description,
  evaluation,
  isCompany,
  onAddToCart,
  isDisabled,
}: SummarySectionProps) => {
  return (
    <SectionWrapper title={title} description={description}>
      <Card>
        <CardHeader>
          <CardTitle>Prijs overzicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            {(evaluation?.pricing.breakdown ?? []).map((item) => (
              <div key={item.key} className="flex justify-between">
                <span>
                  {item.name}
                  {item.quantity ? ` x${item.quantity}` : ''}
                  {item.included ? ' (inbegrepen)' : ''}
                </span>
                <span>€{formatCurrency(isCompany ? item.priceExcl : item.priceIncl)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-4 flex justify-between font-semibold">
            <span>Totaal</span>
            <span>
              €{formatCurrency(isCompany ? evaluation?.pricing.totalExcl ?? 0 : evaluation?.pricing.totalIncl ?? 0)}
            </span>
          </div>
        </CardContent>
      </Card>
      <Button onClick={onAddToCart} disabled={!evaluation || isDisabled}>
        Voeg toe aan winkelwagen
      </Button>
    </SectionWrapper>
  );
};

export default SummarySection;
