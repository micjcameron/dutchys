'use client';

import { useEffect, useState } from 'react';
import ProductDetails from '@/components/ProductDetails';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081';

type Product = {
  id: string;
  name: string;
  description: string;
  basePriceExcl?: number;
  vatRate?: number;
  images?: string[];
  attributes?: Record<string, any>;
  type?: string;
  productType?: string;
  image?: string;
  delivery?: string;
};

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />
);

export default function ProductDetailsLoader({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/public/catalog/products/${productId}`);
        if (!response.ok) {
          throw new Error('Failed to load product');
        }
        const data = await response.json();
        if (isMounted) {
          setProduct(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-sm text-gray-600">Product niet gevonden.</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <SkeletonBlock className="h-[400px] w-full" />
              <div className="grid grid-cols-3 gap-4 mt-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-24 w-full" />
                ))}
              </div>
            </div>
            <div>
              <SkeletonBlock className="h-8 w-3/4" />
              <SkeletonBlock className="h-10 w-1/2 mt-4" />
              <SkeletonBlock className="h-4 w-full mt-6" />
              <SkeletonBlock className="h-4 w-5/6 mt-3" />
              <div className="mt-6 space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonBlock key={index} className="h-4 w-3/4" />
                ))}
              </div>
              <SkeletonBlock className="h-12 w-full mt-8" />
              <div className="border-t border-b py-4 mt-8 space-y-3">
                <SkeletonBlock className="h-5 w-2/3" />
                <SkeletonBlock className="h-5 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
