'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Truck, Shield, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from './Navbar';
import Footer from './Footer';
import { addCartItem, loadCart, setCartId } from '@/utils/localStorage';
import { createCart, updateCart } from '@/api/cartApi';

type Product = {
  id: string;
  name: string;
  description: string;
  basePriceExcl?: number;
  vatRatePercent?: number;
  images?: string[];
  attributes?: Record<string, any>;
  type?: string;
  productType?: string;
  image?: string;
  delivery?: string;
};

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const priceExcl = product.basePriceExcl ?? 0;
  const vatRatePercent = product.vatRatePercent ?? 21;
  const priceIncl = priceExcl * (1 + vatRatePercent / 100);
  const details = product.images?.length ? product.images : product.image ? [product.image] : [];
  const features = product.attributes?.features ?? [];
  const delivery = product.delivery ?? '2-4 weken';
  const rawProductType = product.productType ?? product.type ?? 'HOTTUB';
  const productType =
    rawProductType.toLowerCase() === 'sauna'
      ? 'sauna'
      : rawProductType.toLowerCase() === 'cold_plunge' || rawProductType.toLowerCase() === 'coldplunge'
        ? 'coldPlunge'
        : 'hottub';

  const images = useMemo(() => {
    const unique = Array.from(new Set(details.filter(Boolean)));
    return unique.length > 0 ? unique : ['/placeholders/product-1.png'];
  }, [details]);
  const [mainImage, setMainImage] = useState(images[0]);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    setMainImage(images[0]);
  }, [images]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-gray-100 to-white">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <div className="mb-4 overflow-hidden rounded-2xl shadow-lg">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    width={1200}
                    height={800}
                    className="w-full h-[400px] object-cover"
                    priority
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${image === mainImage ? 'border-brand-orange shadow-md' : 'border-transparent hover:border-brand-orange/50'}`}
                      onClick={() => setMainImage(image)}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        width={240}
                        height={160}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-brand-blue mb-2">{product.name}</h1>
                <p className="text-3xl font-bold text-brand-blue mb-6">
                  €{priceIncl.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}{' '}
                  <span className="text-base font-medium text-gray-500">(incl btw)</span>
                </p>

                <p className="text-gray-600 mb-6">{product.description}</p>

                {features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-brand-blue mb-3">Eigenschappen:</h3>
                    <ul className="space-y-2">
                      {features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-brand-orange mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    className="bg-brand-orange hover:bg-brand-orange/90 text-white flex-grow"
                    onClick={async () => {
                      addCartItem({ productId: product.id, quantity: 1, productType });
                      const cart = loadCart();
                      try {
                        if (!cart.cartId) {
                          const response = await createCart(cart.items);
                          setCartId(response.id);
                        } else {
                          await updateCart(cart.cartId, cart.items);
                        }
                      } catch (error) {
                        console.error('Failed to sync cart:', error);
                      }
                      setAddedToCart(true);
                    }}
                  >
                    {addedToCart ? 'Toegevoegd aan winkelwagen' : 'Toevoegen aan winkelwagen'}
                  </Button>
                </div>

                <div className="border-t border-b py-4 space-y-3">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-brand-blue mr-3" />
                    <div>
                      <p className="font-medium">Levering: {delivery}</p>
                      <p className="text-sm text-gray-500">Levering kies je later tijdens het afrekenen.</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-brand-blue mr-3" />
                    <div>
                      <p className="font-medium">5 jaar garantie</p>
                      <p className="text-sm text-gray-500">Op materiaal- en constructiefouten</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
