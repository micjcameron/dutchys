/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { loadCart, setCartId, setLastPaymentId } from '@/utils/localStorage';
import { createCart, createPayment, createSale } from '@/api/checkoutApi';
import { updateCart } from '@/api/cartApi';
import { ApiProductType, CartItem, CartSummaryEntry, CheckoutFormData } from '@/types/checkout';
import { fetchCatalog } from '@/api/catalogApi';
import { toPriceExcl } from '@/utils/price-util';

type Product = {
  id: string;
  name: string;
  priceExcl: number;
  priceIncl: number;
  productType?: string;
};

const toExcl = (value: number, vatRatePercent = 21) =>
  Math.round(toPriceExcl(value, vatRatePercent) * 100) / 100;
const formatAmountValue = (value: number) => value.toFixed(2);
const toApiProductType = (value?: CartItem['productType']): ApiProductType | undefined => {
  if (value === 'sauna') {
    return 'SAUNA';
  }
  if (value === 'coldPlunge') {
    return 'COLD_PLUNGE';
  }
  if (value === 'hottub') {
    return 'HOTTUB';
  }
  return undefined;
};

const defaultForm: CheckoutFormData = {
  delivery: true,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  houseNumber: '',
  postalCode: '',
  city: '',
  country: 'Nederland',
  deliveryNotes: '',
};

const DELIVERY_FEE = 399;

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<CheckoutFormData>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const getConfiguratorLabel = (productType?: CartItem['productType']) =>
    productType === 'sauna' ? 'sauna' : 'hottub';

  useEffect(() => {
    const cart = loadCart();
    setItems(cart.items || []);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        const catalog = await fetchCatalog();
        const list = (catalog.baseProducts ?? []).map((product: any) => ({
          id: product.id,
          name: product.name,
          productType: product.type,
          priceExcl: product.basePriceExcl ?? 0,
          priceIncl: product.basePriceIncl ?? product.priceIncl ?? 0,
        })) as Product[];
        if (isMounted) {
          setProducts(list);
        }
      } catch (error) {
        console.error('Failed to load catalog products:', error);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const entries = useMemo(() => {
    return items
      .map((item, index) => {
        if (item.type === 'extra') {
          const priceIncl = item.priceIncl || 0;
          const priceExcl = item.priceExcl ?? toExcl(priceIncl);
          const quantity = item.quantity || 1;
          return {
            cartKey: item.id || `extra-${index}`,
            type: 'extra',
            title: item.title || 'Extra',
            quantity,
            priceIncl,
            priceExcl,
            lineTotalIncl: priceIncl * quantity,
            lineTotalExcl: priceExcl * quantity,
          };
        }

        if (item.type === 'configurator') {
          const priceIncl = item.priceIncl || 0;
          const priceExcl = item.priceExcl ?? toExcl(priceIncl);
          const quantity = item.quantity || 1;
          const configuratorLabel = getConfiguratorLabel(item.productType);
          return {
            cartKey: item.id || `config-${index}`,
            type: 'configurator',
            productType: item.productType ?? 'hottub',
            title: item.title || `Maatwerk ${configuratorLabel} configuratie`,
            quantity,
            priceIncl,
            priceExcl,
            lineTotalIncl: priceIncl * quantity,
            lineTotalExcl: priceExcl * quantity,
          };
        }

        const productId = item.productId || item.id;
        const product = products.find((entry) => entry.id === productId) as Product | undefined;
        if (!product) {
          return null;
        }
        const quantity = item.quantity || 1;
        return {
          cartKey: product.id,
          type: 'product',
          productType: product.productType ?? 'hottub',
          title: product.name,
          quantity,
          priceIncl: product.priceIncl,
          priceExcl: product.priceExcl,
          lineTotalIncl: product.priceIncl * quantity,
          lineTotalExcl: product.priceExcl * quantity,
        };
      })
      .filter(Boolean) as CartSummaryEntry[];
  }, [items, products]);

  const subtotalIncl = useMemo(
    () => entries.reduce((total, entry) => total + entry.lineTotalIncl, 0),
    [entries]
  );
  const subtotalExcl = useMemo(
    () => entries.reduce((total, entry) => total + entry.lineTotalExcl, 0),
    [entries]
  );
  const vatTotal = useMemo(() => subtotalIncl - subtotalExcl, [subtotalExcl, subtotalIncl]);
  const deliveryFee = formData.delivery ? DELIVERY_FEE : 0;
  const totalIncl = subtotalIncl + deliveryFee;
  const cartProductType = useMemo(() => {
    const types = items
      .map((item) => item.productType)
      .filter((value): value is NonNullable<typeof value> => Boolean(value));
    if (types.length === 0) {
      return undefined;
    }
    const uniqueTypes = new Set(types);
    return uniqueTypes.size === 1 ? Array.from(uniqueTypes)[0] : undefined;
  }, [items]);

  const handleCheckout = async () => {
    if (entries.length === 0 || isSubmitting) {
      return;
    }

    console.info('[checkout] submit started', {
      entries: entries.length,
      subtotalIncl,
      cartProductType,
    });
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const cart = loadCart();
      let cartId = cart.cartId;
      if (!cartId) {
        console.info('[checkout] creating cart', { items: items.length });
        const cartResponse = await createCart(items);
        cartId = cartResponse.id;
        setCartId(cartId);
        console.info('[checkout] cart created', { cartId });
      } else {
        console.info('[checkout] updating cart', { cartId, items: items.length });
        await updateCart(cartId, items);
        console.info('[checkout] cart updated', { cartId });
      }

      const productTypePayload = toApiProductType(cartProductType);
      console.info('[checkout] creating sale', { cartId, productType: productTypePayload });
      const sale = await createSale({ ...formData, cartId, productType: productTypePayload });
      console.info('[checkout] sale created', { saleId: sale?.id, cartId });

      console.info('[checkout] creating payment', { cartId, saleId: sale?.id });
      const payment = await createPayment({
        amountValue: formatAmountValue(totalIncl),
        currency: 'EUR',
        description: 'Dutchys order',
        metadata: {
          cartId,
          saleId: sale?.id ?? null,
        },
      });
      console.info('[checkout] payment created', { paymentId: payment?.id });
      setLastPaymentId(payment.id);
      window.location.href = payment.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      setErrorMessage('Er ging iets mis tijdens het afrekenen. Probeer het opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <section className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              <Link href="/cart" className="text-brand-orange text-sm font-semibold">
                Terug naar winkelwagen
              </Link>
            </div>

            <CheckoutForm
              value={formData}
              isSubmitting={isSubmitting}
              onChange={setFormData}
              onSubmit={handleCheckout}
            />
            {errorMessage && (
              <p className="mt-4 text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}
          </section>

          <aside className="w-full lg:w-96">
            <OrderSummary
              entries={entries}
              subtotalIncl={subtotalIncl}
              subtotalExcl={subtotalExcl}
              vatTotal={vatTotal}
              deliveryFee={formData.delivery ? DELIVERY_FEE : null}
              totalIncl={totalIncl}
            />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
