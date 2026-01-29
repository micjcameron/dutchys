'use client';

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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

// -------------------------
// helpers
// -------------------------

/**
 * Stable stringify:
 * - removes `undefined` fields
 * - sorts object keys recursively
 * - keeps arrays in order (important for spa.leds qty semantics)
 */
const stableStringify = (value: any): string => {
  const seen = new WeakSet();

  const normalize = (v: any): any => {
    if (v === undefined) return undefined; // caller will drop from objects
    if (v === null) return null;

    if (typeof v !== 'object') return v;

    if (seen.has(v)) return '[Circular]';
    seen.add(v);

    if (Array.isArray(v)) {
      return v.map(normalize);
    }

    const out: Record<string, any> = {};
    const keys = Object.keys(v).sort();
    for (const k of keys) {
      const nv = normalize(v[k]);
      if (nv === undefined) continue; // drop undefined
      out[k] = nv;
    }
    return out;
  };

  return JSON.stringify(normalize(value));
};

// Normalize backend/legacy shapes back into FE shape.
// Hard rule: FE uses spa.leds as string[] (repeated keys = qty).
const normalizeSelections = (sel: ConfigSelections): ConfigSelections => {
  const leds: unknown = sel?.spa?.leds;

  let normalizedLeds: string[] = [];

  if (Array.isArray(leds)) {
    normalizedLeds = leds.filter(Boolean);
  } else if (leds && typeof leds === 'object') {
    // accept legacy qty map shape: { KEY: number }
    normalizedLeds = Object.entries(leds as Record<string, any>).flatMap(([key, qty]) => {
      const n = Number(qty);
      if (!key || !Number.isFinite(n) || n <= 0) return [];
      return Array.from({ length: n }, () => key);
    });
  } else {
    normalizedLeds = [];
  }

  return {
    ...sel,
    spa: sel.spa
      ? {
          ...sel.spa,
          leds: normalizedLeds, // ✅ ALWAYS array (prevents undefined<->[] ping pong)
        }
      : sel.spa,
  };
};

/**
 * Canonicalize FE selections before:
 * - sending to backend (reduce drift)
 * - generating payload keys (reduce eval loops)
 *
 * Key rules:
 * - drop undefined fields (stableStringify also does this, but we also want the actual payload clean)
 * - ensure arrays exist where your FE expects arrays
 * - keep spa.leds as array (qty via duplicates)
 */
const canonicalizeSelections = (sel: ConfigSelections): ConfigSelections => {
  const s = normalizeSelections(sel ?? {});
  // Ensure nested arrays exist (avoid undefined<->[] oscillation from different producers)
  return {
    ...s,
    heating: s.heating
      ? {
          ...s.heating,
          extras: Array.isArray(s.heating.extras) ? s.heating.extras.filter(Boolean) : [],
        }
      : s.heating,
    filtration: s.filtration
      ? {
          ...s.filtration,
          connections: Array.isArray(s.filtration.connections) ? s.filtration.connections.filter(Boolean) : [],
          uv: Array.isArray(s.filtration.uv) ? s.filtration.uv.filter(Boolean) : [],
        }
      : s.filtration,
    extras: s.extras
      ? {
          ...s.extras,
          optionIds: Array.isArray(s.extras.optionIds) ? s.extras.optionIds.filter(Boolean) : [],
        }
      : s.extras,
  };
};

const collectSelectedOptionKeys = (selections: ConfigSelections) => {
  const keys = new Set<string>();
  if (selections.heating?.optionId) keys.add(selections.heating.optionId);
  if (selections.heaterInstallation?.optionId) keys.add(selections.heaterInstallation.optionId);
  if (selections.cooler?.optionId) keys.add(selections.cooler.optionId);

  selections.heating?.extras?.forEach((key) => keys.add(key));
  if (selections.materials?.internalMaterialId) keys.add(selections.materials.internalMaterialId);
  if (selections.materials?.externalMaterialId) keys.add(selections.materials.externalMaterialId);
  if (selections.insulation?.optionId) keys.add(selections.insulation.optionId);

  if (selections.spa?.systemId) keys.add(selections.spa.systemId);

  // IMPORTANT: spa.leds is ALWAYS treated as string[] in FE (repeated keys for qty)
  const leds = selections.spa?.leds;
  if (Array.isArray(leds)) leds.forEach((k) => k && keys.add(k));

  if (selections.lid?.optionId) keys.add(selections.lid.optionId);

  selections.filtration?.connections?.forEach((key) => keys.add(key));
  if (selections.filtration?.filterId) keys.add(selections.filtration.filterId);
  selections.filtration?.uv?.forEach((key) => keys.add(key));
  if (selections.filtration?.filterBoxId) keys.add(selections.filtration.filterBoxId);

  if (selections.stairs?.optionId) keys.add(selections.stairs.optionId);
  if (selections.controlUnit?.optionId) keys.add(selections.controlUnit.optionId);
  if (selections.cover?.optionId) keys.add(selections.cover.optionId);

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
  const prevStepRef = useRef(0);

  // eval guards
  const lastPayloadRef = useRef<string>('');
  const evalSeqRef = useRef(0);
  const evalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // optional: stop “apply resolved selections” causing immediate re-eval for identical canonical payload
  const lastAppliedResolvedPayloadRef = useRef<string>('');

  const isCompany = customerType === 'company';
  const taxLabel = isCompany ? 'excl btw' : 'incl btw';

  useEffect(() => {
    if (stepIndex > prevStepRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    prevStepRef.current = stepIndex;
  }, [stepIndex]);

  // optionMap (source of truth)
  const optionMap = useMemo(() => {
    const map = new Map<string, CatalogOption>();
    (catalog?.options ?? []).forEach((o) => map.set(o.key, o));
    return map;
  }, [catalog?.options]);

  const getOption: GetOption = useCallback((key: string) => optionMap.get(key), [optionMap]);

  const applicableKeySet = useMemo(() => {
    const keys = evaluation?.applicableOptionKeys ?? null;
    if (!keys || keys.length === 0) return null;
    return new Set(keys);
  }, [evaluation?.applicableOptionKeys]);

  const applicableOptionsByGroup = useMemo(() => {
    if (!applicableKeySet) return {};
    const grouped: Record<string, CatalogOption[]> = {};

    (catalog?.options ?? []).forEach((option) => {
      if (!applicableKeySet.has(option.key)) return;
      if (!grouped[option.groupKey]) grouped[option.groupKey] = [];
      grouped[option.groupKey].push(option);
    });

    return grouped;
  }, [catalog?.options, applicableKeySet]);

  const steps = useMemo<ConfiguratorStep[]>(() => {
    if (!template) return [];
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

  const stepRequiresEvaluation = (section: SectionKey | 'CUSTOMER') => {
    if (section === 'CUSTOMER' || section === 'BASE') return false;
    return true;
  };

  const shouldBlockStep =
    !!currentStep &&
    stepRequiresEvaluation(currentStep.section) &&
    (!productId || !customerType || !evaluation);

  // -------------------------
  // session create/reuse
  // -------------------------
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
        console.error('[pc] Failed to create configurator session:', error);
      }
    };

    create();
  }, [productType]);

  useEffect(() => {
    if (!sessionId) return;
    updateSession(sessionId, { productType }).catch((error) => {
      console.error('[pc] Failed to update configurator session:', error);
    });
  }, [sessionId, productType]);

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
      } catch (error) {
        console.error('[pc] Failed to load catalog/template', error);
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
    if (baseId && baseId !== productId) {
      setProductId(baseId);
    }
  }, [selections.baseProductId, productId]);

  // -------------------------
  // evaluation loop (debounce + stale guard + canonical payload)
  // -------------------------
  useEffect(() => {
    if (!productId || !catalog || !customerType) return;

    // ✅ canonicalize selections BEFORE payload & key
    const canonical = canonicalizeSelections(selections);
    const payload = { productId, customerType, selections: canonical };
    const payloadKey = stableStringify(payload);

    if (evalTimerRef.current) clearTimeout(evalTimerRef.current);

    evalTimerRef.current = setTimeout(() => {
      // ✅ if we already evaluated this exact canonical payload, stop
      if (lastPayloadRef.current === payloadKey) return;
      lastPayloadRef.current = payloadKey;

      const seq = ++evalSeqRef.current;
      setIsEvaluating(true);

      evaluateCatalog(payload as any)
        .then((result) => {
          if (seq !== evalSeqRef.current) return;

          setEvaluation(result);
          console.groupCollapsed('[pc] HEATING extras debug');
          const extraKeys = [
            ...(applicableOptionsByGroup.HEATER_ADDONS_INTERNAL ?? []).map(o => o.key),
            ...(applicableOptionsByGroup.HEATER_ADDONS_EXTERNAL ?? []).map(o => o.key),
          ];
          console.log('extra option keys:', extraKeys);
          console.log('disabled reasons:', extraKeys.map(k => [k, result.disabledOptions?.[k]?.reason]).filter(([,r]) => r));
          console.log('applicableOptionKeys includes extras:', extraKeys.filter(k => (result.applicableOptionKeys ?? []).includes(k)));
          console.groupEnd();

          // ✅ normalize + canonicalize what backend resolved
          const resolved = canonicalizeSelections(result.resolvedSelections ?? {});
          const resolvedPayloadKey = stableStringify({ productId, customerType, selections: resolved });

          // ✅ If backend resolved is the same canonical payload we already have, do nothing.
          // Also: avoid applying the exact same resolved payload repeatedly.
          setSelections((prev) => {
            const prevCanonical = canonicalizeSelections(prev);
            const prevKey = stableStringify({ productId, customerType, selections: prevCanonical });

            if (prevKey === resolvedPayloadKey) return prev;

            if (lastAppliedResolvedPayloadRef.current === resolvedPayloadKey) return prev;
            lastAppliedResolvedPayloadRef.current = resolvedPayloadKey;

            console.groupCollapsed('[pc] applying backend resolvedSelections');
            console.log('prev canonical:', prevCanonical);
            console.log('resolved canonical:', resolved);
            console.groupEnd();

            return resolved;
          });
        })
        .catch((error) => {
          if (seq !== evalSeqRef.current) return;
          console.error('[pc] Failed to evaluate configuration', error);
        })
        .finally(() => {
          if (seq === evalSeqRef.current) setIsEvaluating(false);
        });
    }, 200);

    return () => {
      if (evalTimerRef.current) clearTimeout(evalTimerRef.current);
    };
  }, [productId, selections, customerType, catalog]);

  // -------------------------
  // Add to cart
  // -------------------------
  const handleAddToCart = async () => {
    if (!evaluation || !catalog || !productId) return;

    const product = catalog.baseProducts.find((item) => item.id === productId);
    const optionLabels: string[] = [];

    collectSelectedOptionKeys(evaluation.resolvedSelections).forEach((optionKey) => {
      const option = optionMap.get(optionKey);
      if (option) optionLabels.push(option.name);
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
        if (sessionId) await updateSession(sessionId, { cartId: response.id });
      } else {
        await updateCart(cart.cartId, cart.items);
      }
    } catch (error) {
      console.error('[pc] Failed to create cart from configurator:', error);
    }

    toast.success('Toegevoegd aan winkelwagen', {
      description: 'Je configuratie staat klaar in de winkelwagen.',
    });

    router.push('/cart');
  };

  const goNext = () => setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  const goPrev = () => setStepIndex((prev) => Math.max(prev - 1, 0));
  const autoAdvance = () => {
    if (stepIndex >= totalSteps - 1) return;
    goNext();
  };

  // -------------------------
  // Requirements gating by optionGroupKeys (strings from backend)
  // -------------------------
  const getRequirementGroupKey = useCallback(
    (reqKey: string): string | null => {
      if (!reqKey) return null;

      const allTemplateGroupKeys = new Set<string>(
        (template?.steps ?? []).flatMap((s) => (Array.isArray(s.optionGroupKeys) ? s.optionGroupKeys : [])) as string[],
      );
      if (allTemplateGroupKeys.has(reqKey)) return reqKey;

      const opt = getOption(reqKey);
      return opt?.groupKey ?? null;
    },
    [getOption, template?.steps],
  );

  const getStepOptionGroupKeys = useCallback((step: ConfiguratorStep | undefined): string[] => {
    const keys = (step as any)?.optionGroupKeys;
    return Array.isArray(keys) ? (keys as string[]).filter(Boolean) : [];
  }, []);

  const isStepValid = useMemo(() => {
    if (!currentStep) return false;

    if (currentStep.section === 'CUSTOMER') return !!customerType;
    if (currentStep.section === 'BASE') return !!productId;

    if (stepRequiresEvaluation(currentStep.section) && !evaluation) return false;

    const stepGroupKeys = getStepOptionGroupKeys(currentStep);
    if (stepGroupKeys.length === 0) return true;

    const unmet = evaluation?.requirements ?? [];
    const hasUnmetForThisStep = unmet.some((r) => {
      const gk = getRequirementGroupKey(r.key);
      return gk ? stepGroupKeys.includes(gk) : false;
    });

    return !hasUnmetForThisStep;
  }, [currentStep, customerType, productId, evaluation, getRequirementGroupKey, getStepOptionGroupKeys]);

  const stepBlockMessages = useMemo(() => {
    if (!evaluation || !currentStep) return [];
    const stepGroupKeys = getStepOptionGroupKeys(currentStep);
    if (!stepGroupKeys.length) return [];

    return (evaluation.requirements ?? [])
      .filter((r) => {
        const gk = getRequirementGroupKey(r.key);
        return gk ? stepGroupKeys.includes(gk) : false;
      })
      .map((r) => r.message);
  }, [evaluation, currentStep, getRequirementGroupKey, getStepOptionGroupKeys]);

  const headerTotal = useMemo(() => {
    if (evaluation) return isCompany ? evaluation.pricing.totalExcl : evaluation.pricing.totalIncl;
    if (currentProduct) {
      const priceIncl = currentProduct.basePriceIncl ?? currentProduct.basePriceExcl;
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
          />
        );

      case 'HEATER_INSTALLATION':
        return (
          <HeaterInstallationSection
            title={currentStep.title}
            description={currentStep.description}
            options={applicableOptionsByGroup.HEATER_INSTALLATION ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            onAutoAdvance={autoAdvance}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );

      case 'HEATING':
        return (
          <HeatingSection
            title={currentStep.title}
            description={currentStep.description}
            product={currentProduct}
            options={applicableOptionsByGroup.HEATING_BASE ?? []}
            extras={[
              ...(applicableOptionsByGroup.HEATER_ADDONS_INTERNAL ?? []),
              ...(applicableOptionsByGroup.HEATER_ADDONS_EXTERNAL ?? []),
            ]}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
            getOption={getOption}
          />
        );

      case 'COOLER':
        return (
          <CoolerSection
            title={currentStep.title}
            description={currentStep.description}
            options={applicableOptionsByGroup.COOLER_BASE ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );

      case 'MATERIALS':
        return (
          <MaterialsSection
            product={currentProduct}
            title={currentStep.title}
            description={currentStep.description}
            internalOptions={applicableOptionsByGroup.MATERIALS_INTERNAL_BASE ?? []}
            externalOptions={applicableOptionsByGroup.MATERIALS_EXTERNAL_BASE ?? []}
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
            options={applicableOptionsByGroup.INSULATION_BASE ?? []}
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
            options={applicableOptionsByGroup.SPASYSTEM_BASE ?? []}
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
            options={applicableOptionsByGroup.LEDS_BASE ?? []}
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
            options={applicableOptionsByGroup.LID_BASE ?? []}
            selections={selections}
            onSelectionsChange={setSelections}
            evaluation={evaluation}
            isCompany={isCompany}
          />
        );

      case 'COVER':
        return (
          <CoverSection
            title={currentStep.title}
            description={currentStep.description}
            options={applicableOptionsByGroup.COVER_BASE ?? []}
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
            baseOptions={applicableOptionsByGroup.FILTRATION_BASE ?? []}
            addonOptions={applicableOptionsByGroup.FILTRATION_ADDONS ?? []}
            boxOptions={applicableOptionsByGroup.FILTRATION_BOX ?? []}
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
            options={applicableOptionsByGroup.SANDFILTER_BASE ?? []}
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
            options={applicableOptionsByGroup.STAIRS_BASE ?? []}
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
            options={applicableOptionsByGroup.CONTROLUNIT_BASE ?? []}
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
            options={(applicableOptionsByGroup.EXTRAS_BASE ?? []).filter(
              (option) => !option.tags?.includes('HEATING-EXTRA'),
            )}
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

        <div className="relative min-h-[320px]">
          {!shouldBlockStep && renderStep()}

          {shouldBlockStep && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-sm">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Berekenen...</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={goPrev} disabled={stepIndex === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Vorige
          </Button>

          <div className="flex items-center gap-3">
            {stepBlockMessages.length > 0 && (
              <div className="text-sm text-red-600">{stepBlockMessages[0]}</div>
            )}

            {isEvaluating && <span className="text-xs text-gray-500">Berekenen...</span>}

            <Button onClick={goNext} disabled={!isStepValid || stepIndex === totalSteps - 1}>
              Volgende <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductConfigurator;
