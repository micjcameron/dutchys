'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImagePreview from '@/components/configurator/components/ImagePreview';
import { formatCurrency } from '@/components/configurator/utils/pricing';
import { addCartItem, loadCart, setCartId } from '@/utils/localStorage';
import { createCart, updateCart } from '@/api/cartApi';
import type { CatalogOption } from '@/types/catalog';
import { toast } from 'sonner';

type ExtrasGridProps = {
  options: CatalogOption[];
};

const clampQty = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
};

export default function ExtrasGrid({ options }: ExtrasGridProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getQty = (key: string) => quantities[key] ?? 0;

  const setQty = (key: string, next: number) => {
    setQuantities((prev) => ({
      ...prev,
      [key]: clampQty(next),
    }));
  };

  const handleAddToCart = async (option: CatalogOption) => {
    const qty = getQty(option.key);
    if (qty <= 0 || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    addCartItem({
      type: 'extra',
      id: `extra-${option.key}`,
      quantity: qty,
      title: option.name,
      description: option.description,
      image: option.images?.[0],
      priceIncl: option.priceIncl,
      priceExcl: option.priceExcl,
      metadata: {
        optionKey: option.key,
      },
    });

    const cart = loadCart();
    try {
      if (!cart.cartId) {
        const response = await createCart(cart.items);
        setCartId(response.id);
      } else {
        await updateCart(cart.cartId, cart.items);
      }
      toast.success('Toegevoegd aan winkelwagen', {
        description: option.name,
      });
      setQty(option.key, 0);
    } catch (error) {
      console.error('Failed to sync cart:', error);
      toast.error('Kon niet toevoegen aan de winkelwagen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (options.length === 0) {
    return <div className="text-sm text-gray-500">Geen extra's beschikbaar.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {options.map((option) => {
        const qty = getQty(option.key);
        const imageSrc = option.images?.[0] as string | undefined;

        return (
          <Card key={option.key} className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span>{option.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-start gap-3">
                {imageSrc && (
                  <ImagePreview src={imageSrc} alt={option.name} className="h-14 w-16" />
                )}
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-2">{option.description}</p>
                </div>
              </div>
              <div className="text-sm font-semibold text-brand-orange mt-2">
                €{formatCurrency(option.priceIncl)}
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting || qty <= 0}
                  onClick={() => setQty(option.key, qty - 1)}
                >
                  -
                </Button>

                <input
                  type="number"
                  min={0}
                  step={1}
                  value={qty}
                  disabled={isSubmitting}
                  onChange={(event) => setQty(option.key, Number(event.target.value))}
                  className="w-16 rounded-md border px-2 py-1 text-center text-sm"
                />

                <Button
                  variant="outline"
                  size="sm"
                  disabled={isSubmitting}
                  onClick={() => setQty(option.key, qty + 1)}
                >
                  +
                </Button>

                <Button
                  className="ml-auto bg-brand-orange text-white hover:bg-brand-orange/90"
                  disabled={isSubmitting || qty <= 0}
                  onClick={() => handleAddToCart(option)}
                >
                  Voeg toe
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
