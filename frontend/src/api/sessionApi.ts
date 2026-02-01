const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

const handleJsonResponse = async (response: Response) => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export const createSession = async () => {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
  });

  return handleJsonResponse(response);
};

export const getSessionById = async (sessionId: string) => {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);

  return handleJsonResponse(response);
};

export const updateSession = async (
  sessionId: string,
  payload: {
    stepCompleted?: number;
    currentProduct?: Record<string, unknown>;
    cartId?: string;
    productType?: string;
  }
) => {
  const nextPayload = {
    ...payload,
    productType: payload.productType ? payload.productType.toUpperCase() : undefined,
  };
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(nextPayload),
  });

  return handleJsonResponse(response);
};
