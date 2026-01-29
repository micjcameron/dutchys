'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { fetchCatalog, fetchTemplate } from '@/api/catalogApi';
import type { BaseProduct, CatalogOption, ConfiguratorTemplate } from '@/types/catalog';

type CatalogState = {
  baseProducts: BaseProduct[];
  options: CatalogOption[];
};

/**
 * useCatalogData(productType)
 *
 * What it does:
 * - Loads the catalog (baseProducts + options) and the configurator template (step flow) in parallel.
 * - Builds `optionsByGroup` for cheap access: optionsByGroup["HEATING_BASE"], etc.
 * - Returns { catalog, template, optionsByGroup, isLoading }
 *
 * Why it exists:
 * - Keeps ProductConfigurator.tsx from being 600 lines of "load stuff" boilerplate.
 * - Centralizes catalog/template loading behavior and logs.
 *
 * Debugging notes:
 * - Logs show:
 *   - "[catalog] loading catalog/template..."
 *   - "[catalog] loaded ok: baseProducts=... options=... steps=..."
 * - If something is null, check your backend endpoints and API_BASE_URL.
 */
export function useCatalogData(productType: string) {
  const [catalog, setCatalog] = useState<CatalogState | null>(null);
  const [template, setTemplate] = useState<ConfiguratorTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mountIdRef = useRef(Math.random().toString(16).slice(2));

  useEffect(() => {
    let mounted = true;

    console.log(`[catalog][${mountIdRef.current}] loading catalog/template for productType=${productType}`);

    const load = async () => {
      try {
        const [catalogData, templateData] = await Promise.all([
          fetchCatalog(productType),
          fetchTemplate(productType),
        ]);

        if (!mounted) {
          console.warn(`[catalog][${mountIdRef.current}] unmounted during load, ignoring results`);
          return;
        }

        console.log(
          `[catalog][${mountIdRef.current}] loaded catalog ok baseProducts=${catalogData.baseProducts?.length ?? 0
          } options=${catalogData.options?.length ?? 0}`,
        );
        console.log(
          `[catalog][${mountIdRef.current}] loaded template ok steps=${templateData?.steps?.length ?? 0}`,
        );

        setCatalog({ baseProducts: catalogData.baseProducts, options: catalogData.options });
        setTemplate(templateData);
      } catch (err) {
        console.error(`[catalog][${mountIdRef.current}] FAILED to load catalog/template`, err);
      } finally {
        if (mounted) {
          console.log(`[catalog][${mountIdRef.current}] isLoading=false`);
          setIsLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
      console.log(`[catalog][${mountIdRef.current}] cleanup/unmount`);
    };
  }, [productType]);

  const optionsByGroup = useMemo(() => {
    const grouped: Record<string, CatalogOption[]> = {};
    const options = catalog?.options ?? [];

    console.log(`[catalog][${mountIdRef.current}] building optionsByGroup options=${options.length}`);

    options.forEach((opt) => {
      if (!grouped[opt.groupKey]) grouped[opt.groupKey] = [];
      grouped[opt.groupKey].push(opt);
    });

    // Useful debug: what groups exist?
    console.log(
      `[catalog][${mountIdRef.current}] optionsByGroup keys=${Object.keys(grouped).length} [${Object.keys(grouped).join(
        ', ',
      )}]`,
    );

    return grouped;
  }, [catalog]);

  return { catalog, template, optionsByGroup, isLoading };
}
