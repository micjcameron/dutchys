'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Users, Flame, Zap, ArrowRight, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { fetchCatalog } from '@/api/catalogApi';
import { slugify } from '@/lib/utils';

interface Product {
  id: string;
  slug?: string | null;
  name: string;
  description: string;
  shape?: string | null;
  size?: string | null;
  personsMin?: number | null;
  personsMax?: number | null;
  heatingTypes?: string[] | null;
  priceIncl: number;
  priceExcl: number;
  image?: string;
}

type SortOption = 'name' | 'price-low' | 'price-high' | 'personen';

const sortOptions = [
  { value: 'name', label: 'Naam A-Z' },
  { value: 'price-low', label: 'Prijs: Laag naar Hoog' },
  { value: 'price-high', label: 'Prijs: Hoog naar Laag' },
  { value: 'personen', label: 'Aantal personen' },
];

interface ProductGridProps {
  filters: {
    personen: string[];
    formaat: string[];
    vorm: string[];
  };
  productType?: string;
  loading?: boolean;
  onResetFilters?: () => void;
}

export default function ProductGrid({
  filters,
  productType = 'hottub',
  loading = false,
  onResetFilters,
}: ProductGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setDataLoading(true);

    const loadProducts = async () => {
      try {
        const catalog = await fetchCatalog(productType);
        const list = (catalog.baseProducts ?? []).map((product: any) => ({
          id: product.id,
          slug: product.slug ?? null,
          name: product.name,
          description: product.description,
          shape: product.shape ?? null,
          size: product.attributes?.size ?? null,
          personsMin: product.attributes?.personsMin ?? null,
          personsMax: product.attributes?.personsMax ?? null,
          heatingTypes: product.heatingTypes ?? null,
          priceExcl: product.basePriceExcl ?? 0,
          priceIncl: product.basePriceIncl ?? product.priceIncl ?? 0,
          image: product.images?.[0] ?? product.image,
        })) as Product[];
        if (isMounted) {
          setProducts(list);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        if (isMounted) {
          setDataLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, [productType]);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((filter) => filter.length > 0),
    [filters]
  );

  const filteredProducts = useMemo(() => {
    const { personen, formaat, vorm } = filters;
    const normalizeSize = (value: string) =>
      value.toLowerCase().replace(/\s+/g, '').replace('ø', '');
    const normalizedFormaat = formaat.map(normalizeSize);

    return products.filter((product) => {
      const personsLabel =
        product.personsMin && product.personsMax
          ? `${product.personsMin}-${product.personsMax}`
          : null;
      const matchesPersonen = personen.length === 0 || (personsLabel ? personen.includes(personsLabel) : false);
      const matchesFormaat =
        formaat.length === 0 ||
        (product.size ? normalizedFormaat.includes(normalizeSize(product.size)) : false);
      const rawShape = product.shape ? product.shape.toLowerCase() : null;
      const shapeLabel =
        rawShape === 'round' ? 'rond' : rawShape === 'square' ? 'vierkant' : rawShape;
      const matchesVorm = vorm.length === 0 || (shapeLabel ? vorm.includes(shapeLabel) : false);

      return matchesPersonen && matchesFormaat && matchesVorm;
    });
  }, [filters, products]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'price-low') {
        return a.priceIncl - b.priceIncl;
      }
      if (sortBy === 'price-high') {
        return b.priceIncl - a.priceIncl;
      }
      if (sortBy === 'personen') {
        const labelA = `${a.personsMin ?? ''}-${a.personsMax ?? ''}`;
        const labelB = `${b.personsMin ?? ''}-${b.personsMax ?? ''}`;
        return labelA.localeCompare(labelB);
      }
      return 0;
    });
  }, [filteredProducts, sortBy]);

  const isLoading = loading || dataLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg min-h-[340px] animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded mb-3"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  /**
   * To use the assetImagePath function, you need to import it from @/utils/assets.ts
    * <img
          src={assetImagePath("options", option.key)}
          alt={option.name}
        />
        <Image
          src={assetImagePath("products", product.key)}
          alt={product.name}
          width={600}
          height={320}
          className="w-full h-48 object-cover rounded-t-2xl"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
   */

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-gray-600">
          {hasActiveFilters
            ? `${filteredProducts.length} van ${products.length} producten gevonden`
            : `${products.length} producten beschikbaar`}
        </p>

        {filteredProducts.length > 0 && (
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        )}
      </div>

      {filteredProducts.length === 0 && hasActiveFilters && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Geen producten gevonden</h3>
            <p className="text-gray-600 mb-4">
              Probeer je filters aan te passen om meer resultaten te zien.
            </p>
            <button
              onClick={() => onResetFilters?.()}
              className="bg-brand-orange text-white px-4 py-2 rounded-lg hover:bg-brand-orange/90 transition-colors"
            >
              Filters resetten
            </button>
          </div>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 min-h-[340px] flex flex-col h-full max-w-lg w-full mx-auto"
            >
              <div className="relative">
                <Image
                  src={product.image ?? '/placeholders/product-1.png'}
                  alt={product.name}
                  width={600}
                  height={320}
                  className="w-full h-48 object-cover rounded-t-2xl"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-brand-orange transition-colors duration-200">
                  {product.name}
                </h3>
                <div className="text-gray-600 mb-4 flex-1">{product.description}</div>
                <div className="flex flex-row flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-brand-blue text-xs font-inter font-medium whitespace-nowrap">
                    {product.size ?? 'Onbekend'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-brand-blue text-xs font-inter font-medium whitespace-nowrap">
                    <Users className="w-4 h-4 mr-1 text-brand-blue" />
                    {product.personsMin && product.personsMax
                      ? `${product.personsMin}-${product.personsMax} pers.`
                      : 'Onbekend'}
                  </span>
                  {(() => {
                    const heatingLabels = (product.heatingTypes ?? []).map((type) =>
                      type === 'WOOD'
                        ? 'houtgestookt'
                        : type === 'ELECTRIC'
                          ? 'elektrisch'
                          : type === 'HYBRID'
                            ? 'hybride'
                            : type,
                    );
                    const showLabel = heatingLabels.length > 0 ? heatingLabels.join(' / ') : 'n.v.t.';
                    const hasElectric = heatingLabels.includes('elektrisch');
                    return (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full bg-gray-50 border ${
                          hasElectric ? 'border-brand-blue text-brand-blue' : 'border-brand-orange text-brand-orange'
                        } text-xs font-inter font-medium whitespace-nowrap`}
                      >
                        {hasElectric ? (
                          <Zap className="w-4 h-4 mr-1 text-brand-blue" />
                        ) : (
                          <Flame className="w-4 h-4 mr-1 text-brand-orange" />
                        )}
                        {showLabel}
                      </span>
                    );
                  })()}
                </div>
                <div className="text-brand-orange font-semibold text-lg mb-4">
                  €{product.priceIncl.toLocaleString('nl-NL')}
                </div>
                <Link href={`/product/${slugify(product.slug ?? product.name)}--${product.id}`}                 
                className="inline-flex items-center justify-center gap-2 bg-brand-blue text-white rounded-full px-6 py-3 font-medium hover:bg-brand-blue/90 transition-colors"
                >
                  Bekijk details <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
