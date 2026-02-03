import { secureRequest } from "./secureFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

const handleJsonResponse = async (response: Response) => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const createCart = async (items: unknown[], sessionId?: string | null) => {
  const response = await secureRequest(`${API_BASE_URL}/carts`, { items, sessionId: sessionId ?? undefined });

  return handleJsonResponse(response);
};

export const updateCart = async (cartId: string, items: unknown[]) => {
  const response = await secureRequest(`${API_BASE_URL}/carts/${cartId}`, { items }, 'PATCH');

  return handleJsonResponse(response);
};

export const deleteCart = async (cartId: string) => {
  const response = await secureRequest(`${API_BASE_URL}/carts/${cartId}`, undefined, 'DELETE');

  return handleJsonResponse(response);
};
