const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

const handleJsonResponse = async (response: Response) => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const createCart = async (items: unknown[], sessionId?: string | null) => {
  const response = await fetch(`${API_BASE_URL}/carts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items, sessionId: sessionId ?? undefined }),
  });

  return handleJsonResponse(response);
};

export const updateCart = async (cartId: string, items: unknown[]) => {
  const response = await fetch(`${API_BASE_URL}/carts/${cartId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }),
  });

  return handleJsonResponse(response);
};

export const deleteCart = async (cartId: string) => {
  const response = await fetch(`${API_BASE_URL}/carts/${cartId}`, {
    method: 'DELETE',
  });

  return handleJsonResponse(response);
};
