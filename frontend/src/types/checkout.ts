export type CartItem = {
  id?: string;
  type?: 'product' | 'configurator';
  productType?: 'hottub' | 'sauna' | 'coldPlunge';
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
  type: 'product' | 'configurator';
  productType?: 'hottub' | 'sauna' | 'coldPlunge';
  title: string;
  quantity: number;
  priceIncl: number;
  priceExcl: number;
  lineTotalIncl: number;
  lineTotalExcl: number;
};

export type CheckoutFormData = {
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
