import { ApiProductType, CheckoutFormData } from '@/types/checkout';
import { createCart } from '@/api/cartApi';

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
  const response = await fetch(`${API_BASE_URL}/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse(response);
};

export const createPayment = async (payload: {
  amountValue: string;
  currency: string;
  description: string;
  redirectUrl: string;
  webhookUrl?: string;
  metadata?: Record<string, unknown>;
}) => {
  const response = await fetch(`${API_BASE_URL}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return handleJsonResponse(response);
};

export { createCart };
