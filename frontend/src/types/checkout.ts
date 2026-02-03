export type UiProductType = 'hottub' | 'sauna' | 'coldPlunge';
export type ApiProductType = 'HOTTUB' | 'SAUNA' | 'COLD_PLUNGE';

export type CartItem = {
  id?: string;
  type?: 'product' | 'configurator' | 'extra';
  productType?: UiProductType;
  productId?: string;
  quantity: number;
  title?: string;
  description?: string;
  image?: string;
  priceIncl?: number;
  priceExcl?: number;
  options?: string[];
  metadata?: {
    customerType?: 'private' | 'company';
  };
};

export type CartSummaryEntry = {
  cartKey: string;
  type: 'product' | 'configurator' | 'extra';
  productType?: UiProductType;
  title: string;
  quantity: number;
  priceIncl: number;
  priceExcl: number;
  lineTotalIncl: number;
  lineTotalExcl: number;
};

export type CheckoutFormData = {
  delivery: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  deliveryNotes: string;
};
