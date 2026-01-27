'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CollectionHeader from '@/components/CollectionHeader';
import ProductGrid from '@/components/ProductGrid';
import CollectionFilters from '@/components/CollectionFilters';

type Filters = {
  personen: string[];
  formaat: string[];
  vorm: string[];
};

export default function SaunasContent() {
  const [filters, setFilters] = useState<Filters>({
    personen: [],
    formaat: [],
    vorm: []
  });

  const resetFilters = () => {
    setFilters({
      personen: [],
      formaat: [],
      vorm: []
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-gray-100 to-white">
          <CollectionHeader collectionType="saunas" />
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-10">
            <aside className="w-full lg:w-1/4">
              <div className="sticky top-24 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-brand-blue mb-6 pb-3 border-b border-gray-100">Filters</h3>
                <CollectionFilters filters={filters} onFiltersChange={setFilters} />
              </div>
            </aside>
            <div className="w-full lg:w-3/4">
              <ProductGrid
                filters={filters}
                productType="sauna"
                loading={false}
                onResetFilters={resetFilters}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
