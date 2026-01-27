import type { CatalogOptionGroup, CatalogOption, BaseProduct, ConfiguratorTemplate, EvaluationResult, ConfigSelections } from '@/types/catalog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8081';

export type CatalogResponse = {
  baseProducts: BaseProduct[];
  optionGroups: CatalogOptionGroup[];
  options: CatalogOption[];
  rules: Array<Record<string, any>>;
};

type NextFetchInit = RequestInit & { next?: { revalidate?: number } };

const withRevalidate = (init?: RequestInit): NextFetchInit | undefined => {
  if (typeof window === 'undefined') {
    return { ...(init ?? {}), next: { revalidate: 60 } };
  }
  return init;
};

export const fetchCatalog = async (type?: string, init?: RequestInit) => {
  const url = new URL(`${API_BASE_URL}/api/public/catalog`);
  if (type) {
    url.searchParams.set('type', type.toUpperCase());
  }
  const response = await fetch(url.toString(), {
    ...(withRevalidate(init) ?? {}),
  });
  if (!response.ok) {
    throw new Error('Failed to load catalog');
  }
  return response.json() as Promise<CatalogResponse>;
};

export const fetchTemplate = async (type: string, init?: RequestInit) => {
  const url = new URL(`${API_BASE_URL}/api/public/catalog/template`);
  url.searchParams.set('type', type.toUpperCase());
  const response = await fetch(url.toString(), {
    ...(withRevalidate(init) ?? {}),
  });
  if (!response.ok) {
    throw new Error('Failed to load template');
  }
  return response.json() as Promise<ConfiguratorTemplate>;
};

export const evaluateCatalog = async (payload: {
  productId: string;
  customerType?: string | null;
  selections: ConfigSelections;
}) => {
  const response = await fetch(`${API_BASE_URL}/api/public/catalog/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error('Failed to evaluate configuration');
  }
  return response.json() as Promise<EvaluationResult>;
};
