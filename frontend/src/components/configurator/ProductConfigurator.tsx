'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getDisplayPrice } from '@/components/configurator/utils/pricing';
import { toast } from '@/components/ui/sonner';

import {
  addCartItem,
  getConfiguratorSessionId,
  loadCart,
  setCartId,
  setConfiguratorSessionId,
} from '@/utils/localStorage';

import { createSession, getSessionById, updateSession } from '@/api/sessionApi';
import { createCart, updateCart } from '@/api/cartApi';
import { fetchCatalog, fetchTemplate } from '@/api/catalogApi';

import type {
  BaseProduct,
  CatalogOption,
  ConfigSelections,
  ConfiguratorTemplate,
  SectionKey,
  TemplateStep,
  GetOption,
} from '@/types/catalog';

import BaseSection from './sections/BaseSection';
import CoolerSection from './sections/CoolerSection';
import HeaterInstallationSection from './sections/HeaterInstallationSection';
import HeatingSection from './sections/HeatingSection';
import MaterialsSection from './sections/MaterialsSection';
import InsulationSection from './sections/InsulationSection';
import SpaSection from './sections/SpaSection';
import LedsSection from './sections/LedsSection';
import LidSection from './sections/LidSection';
import CoverSection from './sections/CoverSection';
import FiltrationSection from './sections/FiltrationSection';
import StairsSection from './sections/StairsSection';
import ControlUnitSection from './sections/ControlUnitSection';
import ExtrasSection from './sections/ExtrasSection';
import SummarySection from './sections/SummarySection';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

type CustomerType = 'private' | 'company';

type CatalogState = {
  baseProducts: BaseProduct[];
  options: CatalogOption[];
};

export type ConfiguratorStep = Omit<TemplateStep, 'section'> & { section: SectionKey | 'CUSTOMER' };
export type SectionGate = { isValid: boolean; warning?: string | null };

// -------------------------
// helpers
// -------------------------
const collectSelectedOptionKeys = (selections: ConfigSelections) => {
  const keys = new Set<string>();

  if (selections.heating?.optionId) keys.add(selections.heating.optionId);
  if (selections.heating?.internalOptionId) keys.add(selections.heating.internalOptionId);
  if (selections.heating?.externalOptionId) keys.add(selections.heating.externalOptionId);
  if (selections.heaterInstallation?.optionId) keys.add(selections.heaterInstallation.optionId);
  if (selections.cooler?.optionId) keys.add(selections.cooler.optionId);

  selections.heating?.extras?.forEach((k) => k && keys.add(k));

  if (selections.materials?.internalMaterialId) keys.add(selections.materials.internalMaterialId);
  if (selections.materials?.externalMaterialId) keys.add(selections.materials.externalMaterialId);

  if (selections.insulation?.optionId) keys.add(selections.insulation.optionId);

  if (selections.spa?.systemId) keys.add(selections.spa.systemId);
  if (Array.isArray(selections.spa?.leds)) selections.spa!.leds!.forEach((k) => k && keys.add(k));

  if (selections.lid?.optionId) keys.add(selections.lid.optionId);
  if (selections.cover?.optionId) keys.add(selections.cover.optionId);

  selections.filtration?.connections?.forEach((k) => k && keys.add(k));
  if (selections.filtration?.filterId) keys.add(selections.filtration.filterId);
  selections.filtration?.uv?.forEach((k) => k && keys.add(k));
  if (selections.filtration?.filterBoxId) keys.add(selections.filtration.filterBoxId);

  if (selections.stairs?.optionId) keys.add(selections.stairs.optionId);
  if (selections.controlUnit?.optionId) keys.add(selections.controlUnit.optionId);

  selections.extras?.optionIds?.forEach((k) => k && keys.add(k));

  return Array.from(keys);
};

const ProductConfigurator: React.FC = () => {
  const router = useRouter();
  const productType = 'hottub';

  const [catalog, setCatalog] = useState<CatalogState | null>(null);
  const [template, setTemplate] = useState<ConfiguratorTemplate | null>(null);

  const [customerType, setCustomerType] = useState<CustomerType | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [selections, setSelections] = useState<ConfigSelections>({});
  const [stepIndex, setStepIndex] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const prevStepRef = useRef(0);

  const isCompany = customerType === 'company';
  const taxLabel = isCompany ? 'excl btw' : 'incl btw';

  const [sectionValid, setSectionValid] = useState(true);
  const [sectionWarning, setSectionWarning] = useState<string | null>(null);

  const setSectionGate = useCallback((gate: { isValid: boolean; warning?: string | null }) => {
    setSectionValid(gate.isValid);
    setSectionWarning(gate.warning ?? null);
  }, []);

  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, left: 0, behavior });
    document.documentElement?.scrollTo?.({ top: 0, left: 0, behavior });
  };

  useEffect(() => {
    if (stepIndex !== prevStepRef.current) {
      requestAnimationFrame(() => scrollToTop('smooth'));
      prevStepRef.current = stepIndex;
    }
  }, [stepIndex]);

  // -------------------------
  // optionMap (source of truth)
  // -------------------------
  const optionMap = useMemo(() => {
    const map = new Map<string, CatalogOption>();
    (catalog?.options ?? []).forEach((o) => map.set(o.key, o));
    return map;
  }, [catalog?.options]);

  const getOption: GetOption = useCallback((key: string) => optionMap.get(key), [optionMap]);

  const optionsByGroup = useMemo(() => {
    const grouped: Record<string, CatalogOption[]> = {};
    (catalog?.options ?? []).forEach((opt) => {
      const gk = opt.groupKey;
      if (!gk) return;
      if (!grouped[gk]) grouped[gk] = [];
      grouped[gk].push(opt);
    });
    return grouped;
  }, [catalog?.options]);

  // -------------------------
  // steps
  // -------------------------
  const steps = useMemo<ConfiguratorStep[]>(() => {
    if (!template) return [];
    return [
      { id: 'CUSTOMER', section: 'CUSTOMER', title: 'Klanttype', description: 'Kies het type klant' },
      ...template.steps,
    ];
  }, [template]);

  const totalSteps = steps.length;
  const currentStep = steps[stepIndex];

  // ✅ Reset section validity when step changes
  useEffect(() => {
    if (!currentStep) return;

    setSectionWarning(null);

    if (currentStep.section === 'CUSTOMER') {
      setSectionValid(!!customerType);
      return;
    }
    if (currentStep.section === 'BASE') {
      setSectionValid(!!productId);
      return;
    }

    setSectionValid(true);
  }, [currentStep?.id, currentStep?.section, customerType, productId]);

  const isStepValid = useMemo(() => {
    if (!currentStep) return false;

    if (currentStep.section === 'CUSTOMER') return !!customerType;
    if (currentStep.section === 'BASE') return !!productId;

    return !!customerType && !!productId && sectionValid;
  }, [currentStep, customerType, productId, sectionValid]);

  const currentProduct = useMemo(
    () => catalog?.baseProducts.find((p) => p.id === productId) ?? null,
    [catalog, productId],
  );

  const applySelectionsChange = useCallback((update: (prev: ConfigSelections) => ConfigSelections) => {
    setSelections((prev) => update(prev));
  }, []);

  const optionsByGroupKey = useMemo(() => {
    const grouped: Record<string, CatalogOption[]> = {};
    (catalog?.options ?? []).forEach((o) => {
      if (!grouped[o.groupKey]) grouped[o.groupKey] = [];
      grouped[o.groupKey].push(o);
    });
    return grouped;
  }, [catalog?.options]);

  // -------------------------
  // session create/reuse
  // -------------------------
// -------------------------
// session create/reuse (robust)
// - load from localStorage
// - verify server has it
// - if missing -> create new and persist
// -------------------------
useEffect(() => {
  let cancelled = false;

  const ensureSession = async () => {
    const existingSession = getConfiguratorSessionId(productType);

    // 1) Try existing session id (if present)
    if (existingSession) {
      try {
        await getSessionById(existingSession);

        if (cancelled) return;
        setSessionId(existingSession);

        // keep session enriched
        await updateSession(existingSession, { productType }).catch((e) => {
          console.error('[pc] Failed to update configurator session:', e);
        });

        return;
      } catch (e) {
        console.warn('[pc] Stored sessionId not valid anymore, creating new one:', existingSession, e);
        // fallthrough: create a new one
      }
    }

    // 2) Create new session
    try {
      const res = await createSession();
      if (cancelled) return;

      setConfiguratorSessionId(res.id, productType);
      setSessionId(res.id);

      // enrich it
      await updateSession(res.id, { productType }).catch((e) => {
        console.error('[pc] Failed to update configurator session:', e);
      });
    } catch (e) {
      console.error('[pc] Failed to create configurator session:', e);
      if (!cancelled) setSessionId(null);
    }
  };

  ensureSession();

  return () => {
    cancelled = true;
  };
}, [productType]);


  // -------------------------
  // load catalog/template
  // -------------------------
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [catalogData, templateData] = await Promise.all([
          fetchCatalog(productType),
          fetchTemplate(productType),
        ]);
        if (!mounted) return;

        setCatalog({ baseProducts: catalogData.baseProducts, options: catalogData.options });
        setTemplate(templateData);
      } catch (e) {
        console.error('[pc] Failed to load catalog/template', e);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, [productType]);

  // keep productId synced with selections.baseProductId
  useEffect(() => {
    const baseId = selections.baseProductId;
    if (baseId && baseId !== productId) setProductId(baseId);
  }, [selections.baseProductId, productId]);

  // -------------------------
  // Header total
  // -------------------------
  const headerTotal = useMemo(() => {
    const base = currentProduct
      ? getDisplayPrice(
          {
            priceExcl: currentProduct.basePriceExcl,
            priceIncl: currentProduct.basePriceIncl ?? currentProduct.basePriceExcl,
          },
          isCompany,
        )
      : 0;

    const selectedKeys = collectSelectedOptionKeys(selections);
    const optionsTotal = selectedKeys.reduce((acc, key) => {
      const opt = optionMap.get(key);
      if (!opt) return acc;
      const v = isCompany ? (opt.priceExcl ?? 0) : (opt.priceIncl ?? 0);
      return acc + v;
    }, 0);

    return base + optionsTotal;
  }, [currentProduct, isCompany, selections, optionMap]);

  // Register a “finalize” function that runs only when leaving the step via Volgende.
  const stepCommitRef = useRef<null | ((prev: ConfigSelections) => ConfigSelections)>(null);
  const registerStepCommit = useCallback((fn: ((prev: ConfigSelections) => ConfigSelections) | null) => {
    stepCommitRef.current = fn;
  }, []);

  // -------------------------
  // nav
  // -------------------------
  const goNext = () => {
    const commit = stepCommitRef.current;
    if (commit) setSelections((prev) => commit(prev));

    setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
    scrollToTop('smooth');
  };

  const goPrev = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
    scrollToTop('smooth');
  };

  const autoAdvance = () => {
    if (stepIndex >= totalSteps - 1) return;
    goNext();
  };

  // ✅ Jump to a step from Summary
  const goToSection = useCallback(
    (section: SectionKey | 'BASE' | 'CUSTOMER') => {
      const idx = steps.findIndex((s) => s.section === section);
      if (idx >= 0) {
        setStepIndex(idx);
        scrollToTop('smooth');
      }
    },
    [steps],
  );

  // -------------------------
  // Add to cart
  // -------------------------
  const handleAddToCart = async () => {
    if (!catalog || !productId) return;

    const product = catalog.baseProducts.find((p) => p.id === productId);
    const optionLabels: string[] = [];

    collectSelectedOptionKeys(selections).forEach((key) => {
      const opt = optionMap.get(key);
      if (opt) optionLabels.push(opt.name);
    });

    addCartItem({
      type: 'configurator',
      productType,
      quantity: 1,
      title: product?.name ?? 'Maatwerk configuratie',
      description: product?.description ?? '',
      image: product?.images?.[0],
      priceIncl: isCompany ? 0 : headerTotal,
      priceExcl: isCompany ? headerTotal : 0,
      options: optionLabels,
      metadata: {
        customerType: customerType ?? 'private',
        selections,
      },
    });

    const cart = loadCart();
    try {
      if (!cart.cartId) {
        const res = await createCart(cart.items, sessionId);
        setCartId(res.id);
        if (sessionId) await updateSession(sessionId, { cartId: res.id });
      } else {
        await updateCart(cart.cartId, cart.items);
      }
    } catch (e) {
      console.error('[pc] Failed to create/update cart:', e);
    }

    toast.success('Toegevoegd aan winkelwagen', {
      description: 'Je configuratie staat klaar in de winkelwagen.',
    });

    router.push('/cart');
  };

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Configurator laden...</div>;
  }

  if (!catalog || !template) {
    return <div className="p-10 text-center text-gray-500">Configurator niet beschikbaar.</div>;
  }

  const renderStep = () => {
    if (!currentStep) return null;

    if (currentStep.section === 'CUSTOMER') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-brand-blue">Klanttype</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className={
                'cursor-pointer transition-all ' +
                (customerType === 'private'
                  ? 'ring-2 ring-brand-orange bg-brand-orange/5'
                  : 'hover:shadow-md')
              }
              onClick={() => {
                if (customerType === 'private') return;
                setCustomerType('private');
                autoAdvance();
              }}
            >
              <CardHeader>
                <CardTitle>Particulier</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Prijzen inclusief btw.</p>
              </CardContent>
            </Card>

            <Card
              className={
                'cursor-pointer transition-all ' +
                (customerType === 'company'
                  ? 'ring-2 ring-brand-orange bg-brand-orange/5'
                  : 'hover:shadow-md')
              }
              onClick={() => {
                if (customerType === 'company') return;
                setCustomerType('company');
                autoAdvance();
              }}
            >
              <CardHeader>
                <CardTitle>Zakelijk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Prijzen exclusief btw.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    switch (currentStep.section) {
      case 'BASE':
        return (
          <BaseSection
            title={currentStep.title}
            description={currentStep.description}
            products={catalog.baseProducts}
            selectedId={productId}
            onSelect={(id) => {
              setProductId(id);
              setSelections((prev) => ({ ...prev, baseProductId: id }));
            }}
            onAutoAdvance={autoAdvance}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
          />
        );

      case 'HEATER_INSTALLATION':
        return (
          <HeaterInstallationSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroupKey.HEATER_INSTALLATION ?? []}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            onAutoAdvance={autoAdvance}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
          />
        );

      case 'HEATING':
        return (
          <HeatingSection
            title={currentStep.title}
            description={currentStep.description}
            product={currentProduct}
            options={optionsByGroupKey.HEATING_BASE ?? []}
            extras={[
              ...(optionsByGroupKey.HEATER_ADDONS_INTERNAL ?? []),
              ...(optionsByGroupKey.HEATER_ADDONS_EXTERNAL ?? []),
            ]}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            isCompany={isCompany}
            getOption={getOption}
            setSectionGate={setSectionGate}
          />
        );

      case 'COOLER':
        return (
          <CoolerSection
            title={currentStep.title}
            description={currentStep.description}
            options={[...(optionsByGroupKey.COOLER_BASE ?? []), ...(optionsByGroupKey.COOLER_ADD_ON ?? [])]}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
          />
        );

      case 'MATERIALS':
        return (
          <MaterialsSection
            product={currentProduct}
            title={currentStep.title}
            description={currentStep.description}
            internalOptions={optionsByGroupKey.MATERIALS_INTERNAL_BASE ?? []}
            externalOptions={optionsByGroupKey.MATERIALS_EXTERNAL_BASE ?? []}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            setSectionValidity={setSectionValid}
            isCompany={isCompany}
          />
        );

      case 'INSULATION':
        return (
          <InsulationSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroupKey.INSULATION_BASE ?? []}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
          />
        );

      case 'SPA':
        return (
          <SpaSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroupKey.SPASYSTEM_BASE ?? []}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
          />
        );

      case 'LEDS':
        return (
          <LedsSection
            product={currentProduct}
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroupKey.LEDS_BASE ?? []}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
          />
        );

      case 'LID':
        return (
          <LidSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroupKey.LID_BASE ?? []}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
          />
        );

      case 'COVER':
        return (
          <CoverSection
            product={currentProduct}
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroupKey.COVER_BASE ?? []}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            evaluation={null as any}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
          />
        );

      case 'FILTRATION':
        return (
          <FiltrationSection
            title={currentStep.title}
            description={currentStep.description}
            options={[
              ...(optionsByGroupKey.FILTRATION_FILTER_BASE ?? []),
              ...(optionsByGroupKey.FILTRATION_CONNECTOR_BASE ?? []),
              ...(optionsByGroupKey.FILTRATION_ADDONS ?? []),
              ...(optionsByGroupKey.FILTRATION_BOX ?? []),
            ]}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            evaluation={null as any}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
          />
        );

      case 'STAIRS':
        return (
          <StairsSection
            title={currentStep.title}
            description={currentStep.description}
            options={[
              ...(optionsByGroup.STAIRS_BASE ?? []),
              ...(optionsByGroup.STAIRS_COVER_FILTER ?? []),
              ...(optionsByGroupKey.FILTRATION_BOX ?? []),
            ]}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            evaluation={null as any}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
            registerStepCommit={registerStepCommit}
          />
        );

      case 'CONTROLUNIT':
        return (
          <ControlUnitSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.CONTROLUNIT_BASE ?? []}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            evaluation={null as any}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
          />
        );

      case 'EXTRAS':
        return (
          <ExtrasSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.EXTRAS_BASE ?? []}
            selections={selections}
            onSelectionsChange={applySelectionsChange}
            evaluation={null as any}
            isCompany={isCompany}
            setSectionGate={setSectionGate}
          />
        );

      case 'SUMMARY':
        return (
          <SummarySection
            title={currentStep.title}
            description={currentStep.description}
            product={currentProduct}
            options={catalog.options}
            selections={selections}
            isCompany={isCompany}
            onAddToCart={handleAddToCart}
            isDisabled={!productId}
            setSectionGate={setSectionGate}
            onEditSection={goToSection}
          />
        );

      default:
        return null;
    }
  };

  const isSummaryStep = currentStep?.section === 'SUMMARY';

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-brand-blue">Hottub configurator</h1>
            <p className="text-sm text-gray-600">
              Stap {stepIndex + 1} van {totalSteps}
            </p>
          </div>

          <div className="text-right whitespace-nowrap shrink-0">
            <div className="text-2xl font-semibold text-brand-orange inline-flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-gray-500">Totaal:</span>
              <span>€{formatCurrency(headerTotal)}</span>
              <span className="text-lg text-gray-500">({taxLabel})</span>
            </div>
          </div>
        </div>

        <div className="relative min-h-[320px]">{renderStep()}</div>

        <div className="flex items-center justify-between gap-4">
          <Button variant="outline" onClick={goPrev} disabled={stepIndex === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Terug
          </Button>

          {/* ✅ hide “Volgende” on Summary */}
          {!isSummaryStep && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-flex">
                    <Button onClick={goNext} disabled={!isStepValid || stepIndex === totalSteps - 1}>
                      Volgende <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </span>
                </TooltipTrigger>

                {!isStepValid && sectionWarning && stepIndex !== totalSteps - 1 && (
                  <TooltipContent>
                    <p>{sectionWarning}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductConfigurator;
