'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { createSession, updateSession } from '@/api/sessionApi';
import { createCart, updateCart } from '@/api/cartApi';
import { evaluateCatalog, fetchCatalog, fetchTemplate } from '@/api/catalogApi';
import type {
  BaseProduct,
  CatalogOption,
  ConfigSelections,
  ConfiguratorTemplate,
  EvaluationResult,
  SectionKey,
  TemplateStep,
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
import FiltrationSection from './sections/FiltrationSection';
import SandFilterSection from './sections/SandFilterSection';
import StairsSection from './sections/StairsSection';
import ControlUnitSection from './sections/ControlUnitSection';
import ExtrasSection from './sections/ExtrasSection';
import SummarySection from './sections/SummarySection';

type CustomerType = 'private' | 'company';

type CatalogState = {
  baseProducts: BaseProduct[];
  options: CatalogOption[];
};

type ConfiguratorStep = Omit<TemplateStep, 'section'> & { section: SectionKey | 'CUSTOMER' };

const collectSelectedOptionKeys = (selections: ConfigSelections) => {
  const keys = new Set<string>();
  if (selections.heating?.optionId) keys.add(selections.heating.optionId);
  selections.heating?.extras?.forEach((key) => keys.add(key));
  if (selections.materials?.internalMaterialId) keys.add(selections.materials.internalMaterialId);
  if (selections.materials?.externalMaterialId) keys.add(selections.materials.externalMaterialId);
  if (selections.insulation?.optionId) keys.add(selections.insulation.optionId);
  if (selections.spa?.systemId) keys.add(selections.spa.systemId);
  selections.spa?.leds?.forEach((key) => keys.add(key));
  if (selections.lid?.optionId) keys.add(selections.lid.optionId);
  selections.filtration?.connections?.forEach((key) => keys.add(key));
  if (selections.filtration?.filterId) keys.add(selections.filtration.filterId);
  selections.filtration?.uv?.forEach((key) => keys.add(key));
  if (selections.filtration?.sandFilterBox) keys.add(selections.filtration.sandFilterBox);
  if (selections.stairs?.optionId) keys.add(selections.stairs.optionId);
  if (selections.controlUnit?.optionId) keys.add(selections.controlUnit.optionId);
  selections.extras?.optionIds?.forEach((key) => keys.add(key));
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
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const lastEvalRef = useRef<string>('');

  const isCompany = customerType === 'company';
  const taxLabel = isCompany ? 'excl btw' : 'incl btw';

  const optionsByGroup = useMemo(() => {
    const grouped: Record<string, CatalogOption[]> = {};
    (catalog?.options ?? []).forEach((option) => {
      if (!grouped[option.groupKey]) {
        grouped[option.groupKey] = [];
      }
      grouped[option.groupKey].push(option);
    });
    return grouped;
  }, [catalog]);

  const steps = useMemo<ConfiguratorStep[]>(() => {
    if (!template) {
      return [];
    }
    return [
      { id: 'CUSTOMER', section: 'CUSTOMER', title: 'Klanttype', description: 'Kies het type klant' },
      ...template.steps,
    ];
  }, [template]);

  const totalSteps = steps.length;
  const currentStep = steps[stepIndex];
  const currentProduct = useMemo(
    () => catalog?.baseProducts.find((product) => product.id === productId) ?? null,
    [catalog, productId],
  );

  useEffect(() => {
    const existingSession = getConfiguratorSessionId(productType);
    if (existingSession) {
      setSessionId(existingSession);
      return;
    }

    const create = async () => {
      try {
        const response = await createSession();
        setConfiguratorSessionId(response.id, productType);
        setSessionId(response.id);
      } catch (error) {
        console.error('Failed to create configurator session:', error);
      }
    };

    create();
  }, []);

  useEffect(() => {
    if (!sessionId) {
      return;
    }
    updateSession(sessionId, { productType }).catch((error) => {
      console.error('Failed to update configurator session:', error);
    });
  }, [sessionId]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [catalogData, templateData] = await Promise.all([
          fetchCatalog(productType),
          fetchTemplate(productType),
        ]);
        if (!isMounted) {
          return;
        }
        setCatalog({ baseProducts: catalogData.baseProducts, options: catalogData.options });
        setTemplate(templateData);
      } catch (error) {
        console.error('Failed to load catalog/template', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const baseId = selections.baseProductId;
    if (baseId && baseId !== productId) {
      setProductId(baseId);
    }
  }, [selections.baseProductId, productId]);

  useEffect(() => {
    if (!productId || !catalog) {
      return;
    }

    const payload = {
      productId,
      customerType: customerType ?? undefined,
      selections,
    };
    const payloadKey = JSON.stringify(payload);
    if (lastEvalRef.current === payloadKey) {
      return;
    }

    setIsEvaluating(true);
    evaluateCatalog(payload)
      .then((result) => {
        setEvaluation(result);
        const resolvedSelections = result.resolvedSelections ?? {};
        const resolvedKey = JSON.stringify({ productId, selections: resolvedSelections, customerType });
        lastEvalRef.current = resolvedKey;
        if (JSON.stringify(resolvedSelections) !== JSON.stringify(selections)) {
          setSelections(resolvedSelections);
        }
      })
      .catch((error) => {
        console.error('Failed to evaluate configuration', error);
      })
      .finally(() => setIsEvaluating(false));
  }, [productId, selections, customerType, catalog]);

  const handleAddToCart = async () => {
    if (!evaluation || !catalog || !productId) {
      return;
    }

    const product = catalog.baseProducts.find((item) => item.id === productId);
    const optionMap = new Map<string, CatalogOption>();
    catalog.options.forEach((option) => optionMap.set(option.key, option));
    const optionLabels: string[] = [];

    collectSelectedOptionKeys(evaluation.resolvedSelections).forEach((optionKey) => {
      const option = optionMap.get(optionKey);
      if (option) {
        optionLabels.push(option.name);
      }
    });

    addCartItem({
      type: 'configurator',
      productType,
      quantity: 1,
      title: product?.name ?? 'Maatwerk configuratie',
      description: product?.description ?? '',
      image: product?.images?.[0],
      priceIncl: evaluation.pricing.totalIncl,
      priceExcl: evaluation.pricing.totalExcl,
      options: optionLabels,
      metadata: {
        customerType: customerType ?? 'private',
        selections: evaluation.resolvedSelections,
        breakdown: evaluation.pricing.breakdown,
      },
    });

    const cart = loadCart();
    try {
      if (!cart.cartId) {
        const response = await createCart(cart.items, sessionId);
        setCartId(response.id);
        if (sessionId) {
          await updateSession(sessionId, { cartId: response.id });
        }
      } else {
        await updateCart(cart.cartId, cart.items);
      }
    } catch (error) {
      console.error('Failed to create cart from configurator:', error);
    }

    toast.success('Toegevoegd aan winkelwagen', {
      description: 'Je configuratie staat klaar in de winkelwagen.',
    });

    router.push('/cart');
  };

  const goNext = () => setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  const goPrev = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const isStepValid = useMemo(() => {
    if (!currentStep) {
      return false;
    }
    if (currentStep.section === 'CUSTOMER') {
      return !!customerType;
    }
    if (currentStep.section === 'BASE') {
      return !!productId;
    }
    return true;
  }, [currentStep, customerType, productId]);

  const headerTotal = useMemo(() => {
    if (evaluation) {
      return isCompany ? evaluation.pricing.totalExcl : evaluation.pricing.totalIncl;
    }
    if (currentProduct) {
      const priceIncl =
        currentProduct.basePriceExcl * (1 + (currentProduct.vatRatePercent ?? 21) / 100);
      return getDisplayPrice({ priceExcl: currentProduct.basePriceExcl, priceIncl }, isCompany);
    }
    return 0;
  }, [evaluation, currentProduct, isCompany]);

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Configurator laden...</div>;
  }

  if (!catalog || !template) {
    return <div className="p-10 text-center text-gray-500">Configurator niet beschikbaar.</div>;
  }

  const renderStep = () => {
    if (!currentStep) {
      return null;
    }

    if (currentStep.section === 'CUSTOMER') {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-brand-blue">Klanttype</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className={`cursor-pointer transition-all ${customerType === 'private' ? 'ring-2 ring-brand-orange bg-brand-orange/5' : 'hover:shadow-md'}`}
              onClick={() => setCustomerType('private')}
            >
              <CardHeader>
                <CardTitle>Particulier</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Prijzen inclusief btw.</p>
              </CardContent>
            </Card>
            <Card
              className={`cursor-pointer transition-all ${customerType === 'company' ? 'ring-2 ring-brand-orange bg-brand-orange/5' : 'hover:shadow-md'}`}
              onClick={() => setCustomerType('company')}
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
            isCompany={isCompany}
          />
        );
      case 'HEATING':
        return (
          <HeatingSection
            title={currentStep.title}
            description={currentStep.description}
            product={currentProduct}
            options={optionsByGroup.HEATING_BASE ?? []}
            extras={(optionsByGroup.EXTRAS_BASE ?? []).filter((option) => option.tags?.includes('HEATING-EXTRA'))}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'COOLER':
        return (
          <CoolerSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.COOLER_BASE ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'HEATER_INSTALLATION':
        return (
          <HeaterInstallationSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.HEATER_INSTALLATION ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'MATERIALS':
        return (
          <MaterialsSection
            title={currentStep.title}
            description={currentStep.description}
            internalOptions={optionsByGroup['MATERIALS-INTERNAL_BASE'] ?? []}
            externalOptions={optionsByGroup['MATERIALS-EXTERNAL_BASE'] ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'INSULATION':
        return (
          <InsulationSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.INSULATION_BASE ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'SPA':
        return (
          <SpaSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.SPASYSTEM_BASE ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'LEDS':
        return (
          <LedsSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.LEDS_BASE ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'LID':
        return (
          <LidSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.LID_BASE ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'FILTRATION':
        return (
          <FiltrationSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.FILTRATION_BASE ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'SANDFILTER':
        return (
          <SandFilterSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.SANDFILTER_BASE ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'STAIRS':
        return (
          <StairsSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.STAIRS_BASE ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'CONTROLUNIT':
        return (
          <ControlUnitSection
            title={currentStep.title}
            description={currentStep.description}
            options={optionsByGroup.CONTROLUNIT_BASE ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'EXTRAS':
        return (
          <ExtrasSection
            title={currentStep.title}
            description={currentStep.description}
            options={(optionsByGroup.EXTRAS_BASE ?? []).filter((option) => !option.tags?.includes('HEATING-EXTRA'))}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );
      case 'SUMMARY':
        return (
          <SummarySection
            title={currentStep.title}
            description={currentStep.description}
            evaluation={evaluation}
            isCompany={isCompany}
            onAddToCart={handleAddToCart}
            isDisabled={!productId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-blue">Hottub configurator</h1>
          <p className="text-sm text-gray-600">Stap {stepIndex + 1} van {totalSteps}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Totaal</div>
          <div className="text-xl font-semibold text-brand-orange">
            €{formatCurrency(headerTotal)}
            <span className="text-xs text-gray-500 ml-2">({taxLabel})</span>
          </div>
        </div>
      </div>

      {renderStep()}

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goPrev} disabled={stepIndex === 0}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Vorige
        </Button>
        <div className="flex items-center gap-3">
          {isEvaluating && <span className="text-xs text-gray-500">Berekenen...</span>}
          <Button onClick={goNext} disabled={!isStepValid || stepIndex === totalSteps - 1}>
            Volgende <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductConfigurator;
