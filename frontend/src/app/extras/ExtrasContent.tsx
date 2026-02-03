'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExtrasGrid from '@/components/extras/ExtrasGrid';
import { fetchCatalog } from '@/api/catalogApi';
import type { CatalogOption } from '@/types/catalog';
import { GROUP_KEY } from '@/types/optionGroups';

export default function ExtrasContent() {
  const [options, setOptions] = useState<CatalogOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const loadOptions = async () => {
      setIsLoading(true);
      setErrorMessage('');
      try {
        const catalog = await fetchCatalog();
        const extras = (catalog.options ?? []).filter(
          (option) => option.groupKey === GROUP_KEY.EXTRAS_BASE,
        );
        if (isMounted) {
          setOptions(extras);
        }
      } catch (error) {
        console.error('Failed to load extras:', error);
        if (isMounted) {
          setErrorMessage("Kon de extra's niet laden. Probeer het later opnieuw.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (isLoading) {
      return <div className="text-sm text-gray-500">Extra's laden...</div>;
    }
    if (errorMessage) {
      return <div className="text-sm text-red-600">{errorMessage}</div>;
    }
    return <ExtrasGrid options={options} />;
  }, [isLoading, errorMessage, options]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-gray-100 to-white">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-brand-blue mt-4">
              Extra's voor jouw hottub
            </h1>
            <p className="text-gray-700 text-lg mt-4 max-w-2xl mx-auto">
              Voeg accessoires toe zoals thermometers, hoofdsteunen en meer. Kies de aantallen en
              voeg ze direct toe aan je winkelwagen.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-10">
          {content}
        </div>
      </main>
      <Footer />
    </div>
  );
}
