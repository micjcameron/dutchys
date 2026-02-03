import { secureRequest } from "./secureFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

const handleJsonResponse = async (response: Response) => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return response.json();
};

export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
};

export const submitContactForm = async (payload: ContactFormPayload) => {
  const response = await secureRequest(`${API_BASE_URL}/communication/contact`, payload);
  return handleJsonResponse(response);
};
