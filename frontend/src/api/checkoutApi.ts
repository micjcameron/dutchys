import { ApiProductType, CheckoutFormData } from '@/types/checkout';
import { createCart } from '@/api/cartApi';
import { secureRequest } from './secureFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const handleJsonResponse = async (response: Response) => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const createSale = async (
  payload: CheckoutFormData & { cartId: string; productType?: ApiProductType }
) => {
  const response = await secureRequest(`${API_BASE_URL}/sales`, payload, 'POST');

  return handleJsonResponse(response);
};

export const createPayment = async (payload: {
  amountValue: string;
  currency: string;
  description: string;
  metadata?: Record<string, unknown>;
}) => {
  const response = await secureRequest(`${API_BASE_URL}/payments`, payload, 'POST');

  return handleJsonResponse(response);
};

export { createCart };
