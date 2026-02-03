'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { clearCartId, loadCart, updateCartItemQuantity, removeCartItem } from '@/utils/localStorage';
import { deleteCart, updateCart } from '@/api/cartApi';
import { fetchCatalog } from '@/api/catalogApi';
import { toPriceExcl, toPriceIncl } from '@/utils/price-util';

type CartItem = {
  id?: string;
  type?: 'product' | 'configurator' | 'extra';
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

type Product = {
  id: string;
  name: string;
  description: string;
  productType?: string;
  priceExcl: number;
  priceIncl: number;
  image?: string;
  attributes?: Record<string, any>;
  heatingTypes?: string[] | null;
};

type CartEntry = {
  cartKey: string;
  type: 'product' | 'configurator' | 'extra';
  productType?: 'hottub' | 'sauna' | 'coldPlunge';
  title: string;
  description?: string;
  image?: string;
  quantity: number;
  priceIncl: number;
  priceExcl: number;
  lineTotalIncl: number;
  lineTotalExcl: number;
  badges: string[];
  options?: string[];
};

const VAT_RATE_DEFAULT_PERCENT = 21;

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);

  const getConfiguratorLabel = (productType?: CartItem['productType']) =>
    productType === 'sauna' ? 'sauna' : 'hottub';

  const normalizeProductType = (value?: string): CartItem['productType'] => {
    const normalized = (value ?? '').toLowerCase();
    if (normalized === 'sauna') return 'sauna';
    if (normalized === 'cold_plunge' || normalized === 'coldplunge') return 'coldPlunge';
    return 'hottub';
  };

  useEffect(() => {
    const cart = loadCart();
    setItems(cart.items || []);
    setCartId(cart.cartId ?? null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const catalog = await fetchCatalog();
        const list = (catalog.baseProducts ?? []).map((product: any) => ({
          id: product.id,
          name: product.name,
          description: product.description,
          productType: product.type,
          priceExcl: product.basePriceExcl ?? 0,
          priceIncl: product.basePriceIncl ?? product.priceIncl ?? 0,
          image: product.images?.[0] ?? product.image,
          attributes: product.attributes ?? {},
          heatingTypes: product.heatingTypes ?? null,
        })) as Product[];

        if (isMounted) setProducts(list);
      } catch (error) {
        console.error('Failed to load catalog products:', error);
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (value: number) => value.toLocaleString('nl-NL', { minimumFractionDigits: 2 });

  const round2 = (n: number) => Math.round(n * 100) / 100;

  const toExcl = (incl: number, vatRatePercent = VAT_RATE_DEFAULT_PERCENT) =>
    round2(toPriceExcl(incl, vatRatePercent));

  const toIncl = (excl: number, vatRatePercent = VAT_RATE_DEFAULT_PERCENT) =>
    round2(toPriceIncl(excl, vatRatePercent));

  // ✅ robust: treat 0 as "missing" for configurator items,
  // because you store either incl OR excl depending on customer type.
  const normalizeConfiguratorPrices = (
    rawIncl?: number,
    rawExcl?: number,
    vatRatePercent = VAT_RATE_DEFAULT_PERCENT,
  ) => {
    const incl = typeof rawIncl === 'number' && Number.isFinite(rawIncl) ? rawIncl : 0;
    const excl = typeof rawExcl === 'number' && Number.isFinite(rawExcl) ? rawExcl : 0;

    if (incl > 0 && excl > 0) return { priceIncl: incl, priceExcl: excl };
    if (incl > 0 && excl <= 0) return { priceIncl: incl, priceExcl: toExcl(incl, vatRatePercent) };
    if (excl > 0 && incl <= 0) return { priceIncl: toIncl(excl, vatRatePercent), priceExcl: excl };

    return { priceIncl: 0, priceExcl: 0 };
  };

  const entries = useMemo(() => {
    return items
      .map((item, index) => {
        if (item.type === 'extra') {
          const quantity = item.quantity || 1;
          const priceIncl = item.priceIncl ?? 0;
          const priceExcl = item.priceExcl ?? toExcl(priceIncl);

          return {
            cartKey: item.id || `extra-${index}`,
            type: 'extra' as const,
            title: item.title || 'Extra',
            description: item.description,
            image: item.image,
            quantity,
            priceIncl,
            priceExcl,
            lineTotalIncl: priceIncl * quantity,
            lineTotalExcl: priceExcl * quantity,
            badges: ['Extra'],
            options: item.options || [],
          };
        }

        if (item.type === 'configurator') {
          const quantity = item.quantity || 1;
          const configuratorLabel = getConfiguratorLabel(item.productType);

          const { priceIncl, priceExcl } = normalizeConfiguratorPrices(item.priceIncl, item.priceExcl);

          const baseTitle = item.title ?? configuratorLabel;
          const title = baseTitle.toLowerCase().includes('maatwerk')
            ? baseTitle
            : `Maatwerk ${baseTitle}`;

          return {
            cartKey: item.id || `config-${index}`,
            type: 'configurator' as const,
            productType: item.productType ?? 'hottub',
            title: title,
            description: item.description,
            image: item.image,
            quantity,
            priceIncl,
            priceExcl,
            lineTotalIncl: priceIncl * quantity,
            lineTotalExcl: priceExcl * quantity,
            badges: [
              item.metadata?.customerType === 'company' ? 'Zakelijk' : 'Particulier',
              'Maatwerk configuratie',
            ],
            options: item.options || [],
          };
        }

        const productId = item.productId || item.id;
        const product = products.find((entry) => entry.id === productId);
        if (!product) return null;

        const quantity = item.quantity || 1;

        const persons =
          product.attributes?.personsMin && product.attributes?.personsMax
            ? `${product.attributes.personsMin}-${product.attributes.personsMax}`
            : null;

        const size = product.attributes?.size ?? null;

        const heatingLabels = (product.heatingTypes ?? []).map((type) =>
          type === 'WOOD'
            ? 'houtgestookt'
            : type === 'ELECTRIC'
              ? 'elektrisch'
              : type === 'HYBRID'
                ? 'hybride'
                : type,
        );

        return {
          cartKey: product.id,
          type: 'product' as const,
          productType: normalizeProductType(product.productType),
          title: product.name,
          description: product.description,
          image: product.image,
          quantity,
          priceIncl: product.priceIncl,
          priceExcl: product.priceExcl,
          lineTotalIncl: product.priceIncl * quantity,
          lineTotalExcl: product.priceExcl * quantity,
          badges: [
            persons ? `Capaciteit: ${persons} personen` : 'Capaciteit: onbekend',
            heatingLabels.length > 0 ? `Verwarming: ${heatingLabels.join(' / ')}` : 'Verwarming: n.v.t.',
            size ?? 'Afmeting: onbekend',
          ],
        };
      })
      .filter(Boolean) as CartEntry[];
  }, [items, products]);

  const syncCart = async (nextItems: CartItem[]) => {
    if (!cartId) return;

    try {
      if (nextItems.length === 0) {
        await deleteCart(cartId);
        clearCartId();
        setCartId(null);
        return;
      }
      await updateCart(cartId, nextItems);
    } catch (error) {
      console.error('Failed to sync cart:', error);
    }
  };

  const handleQuantityChange = (cartKey: string, nextQuantity: number) => {
    const updatedItems = updateCartItemQuantity(cartKey, nextQuantity);
    setItems(updatedItems);
    void syncCart(updatedItems);
  };

  const handleRemoveItem = (cartKey: string) => {
    const updatedItems = removeCartItem(cartKey);
    setItems(updatedItems);
    void syncCart(updatedItems);
  };

  const subtotalIncl = useMemo(() => entries.reduce((total, entry) => total + entry.lineTotalIncl, 0), [entries]);
  const subtotalExcl = useMemo(() => entries.reduce((total, entry) => total + entry.lineTotalExcl, 0), [entries]);
  const vatTotal = useMemo(() => subtotalIncl - subtotalExcl, [subtotalExcl, subtotalIncl]);

  const showShellWarning = entries.length > 0 && entries.every((entry) => entry.type === 'product');

  const contactMessage = useMemo(() => {
    if (entries.length === 0) return null;
    const hasConfigurator = entries.some((entry) => entry.type === 'configurator');

    return hasConfigurator
      ? 'De configuratie(s) in je winkelwagen worden handmatig besproken. We nemen contact met je op voor bevestiging.'
      : 'Neem contact met ons op om je bestelling te finaliseren.';
  }, [entries]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <section className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Winkelwagen</h1>
              <p className="text-sm text-gray-500">{entries.length} items</p>
            </div>

            {entries.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <p className="text-gray-600 mb-4">Je winkelwagen is leeg.</p>
                <Link href="/" className="text-brand-orange font-semibold">
                  Bekijk onze producten
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {entries.map((entry) => (
                  <div key={entry.cartKey} className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-6">
                      {entry.image && (
                        <div className="w-full md:w-40 h-32 bg-gray-100 rounded-xl overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={entry.image} alt={entry.title} className="w-full h-full object-cover" />
                        </div>
                       )}

                      <div className="flex-1 min-w-0">
                        {/* Title + description */}
                        <div className="space-y-1">
                          <h2 className="text-xl font-semibold text-gray-900">{entry.title}</h2>
                          {entry.description && (
                            <p className="text-gray-600 text-sm">{entry.description}</p>
                          )}
                        </div>

                        {/* Price block — now aligned with items list */}
                        <div className="mt-4 space-y-1">
                          <p className="text-lg font-semibold text-gray-900">
                            €{formatCurrency(entry.lineTotalIncl)}
                          </p>
                          <p className="text-xs text-gray-500">
                            €{formatCurrency(entry.lineTotalExcl)} excl. btw
                          </p>
                        </div>

                        {/* Badges */}
                        {entry.badges.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {entry.badges.map((badge) => (
                              <span
                                key={badge}
                                className="px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-600"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Options list */}
                        {entry.options && entry.options.length > 0 && (
                          <div className="mt-4 text-sm text-gray-600 space-y-1">
                            {entry.options.map((option) => (
                              <div key={option}>{option}</div>
                            ))}
                          </div>
                        )}    

                        <div className="flex items-center gap-4 mt-6">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(entry.cartKey, entry.quantity - 1)}
                              disabled={entry.quantity <= 1}
                            >
                              -
                            </Button>
                            <span className="min-w-[32px] text-center">{entry.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(entry.cartKey, entry.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>

                          <Button variant="ghost" onClick={() => handleRemoveItem(entry.cartKey)}>
                            Verwijderen
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <aside className="w-full lg:w-96">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Overzicht</h2>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotaal (incl.)</span>
                  <span>€{formatCurrency(subtotalIncl)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotaal (excl.)</span>
                  <span>€{formatCurrency(subtotalExcl)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Btw</span>
                  <span>€{formatCurrency(vatTotal)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-base font-semibold text-gray-900">
                  <span>Totaal</span>
                  <span>€{formatCurrency(subtotalIncl)}</span>
                </div>
              </div>

              {contactMessage && (
                <div className="mt-6 bg-gray-50 p-4 rounded-xl text-sm text-gray-600">{contactMessage}</div>
              )}

              <Button className="w-full mt-6" disabled={entries.length === 0}>
                <Link href="/checkout">Doorgaan naar checkout</Link>
              </Button>

              {showShellWarning && (
                <p className="text-xs text-gray-500 mt-4">
                  Let op: bestellingen van standaardproducten worden handmatig bevestigd.
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
