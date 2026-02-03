'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { clearCart, clearLastPaymentId, getLastPaymentId } from '@/utils/localStorage';

type PaymentResponse = {
  id: string;
  molliePaymentId: string | null;
  status: string;
  amountValue: string;
  currency: string;
  description: string | null;
  createdAt: string;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';
const failedStatuses = new Set(['FAILED', 'CANCELED', 'EXPIRED']);
const statusLabels: Record<string, string> = {
  PAID: 'Betaald',
  PENDING: 'In behandeling',
  OPEN: 'Openstaand',
  AUTHORIZED: 'Geautoriseerd',
  FAILED: 'Mislukt',
  CANCELED: 'Geannuleerd',
  EXPIRED: 'Verlopen',
};

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const paymentId = searchParams.get('paymentId') ?? searchParams.get('id');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const resolvedPaymentId = paymentId ?? getLastPaymentId();
    if (!resolvedPaymentId) {
      console.warn('[payment-success] missing payment id');
      setErrorMessage('Geen betaalreferentie gevonden.');
      return;
    }

    let isActive = true;
    const fetchPayment = async () => {
      try {
        console.info('[payment-success] fetching payment', { resolvedPaymentId });
        const response = await fetch(`${apiBaseUrl}/payments/${resolvedPaymentId}`);
        if (!response.ok) {
          const message = await response.text();
          throw new Error(message || 'Betaling niet gevonden.');
        }
        const data = (await response.json()) as PaymentResponse;
        if (isActive) {
          setPayment(data);
          clearLastPaymentId();
          if (data.status === 'PAID') {
            clearCart();
          }
          console.info('[payment-success] payment loaded', {
            id: data.id,
            status: data.status,
            molliePaymentId: data.molliePaymentId,
          });
        }
      } catch (error) {
        if (isActive) {
          console.error('[payment-success] fetch failed', error);
          const message = error instanceof Error ? error.message : 'Er ging iets mis bij het ophalen van je betaling.';
          setErrorMessage(message);
        }
      }
    };

    void fetchPayment();

    return () => {
      isActive = false;
    };
  }, [isHydrated, paymentId]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">Bedankt voor je bestelling!</h1>
            {errorMessage ? (
              <p className="text-red-600">{errorMessage}</p>
            ) : payment ? (
              <>
                {failedStatuses.has(payment.status) ? (
                  <>
                    <p className="text-red-600 mb-2">Er ging iets mis met de betaling.</p>
                    <p className="text-gray-600 mb-4">
                      Probeer het opnieuw of neem contact met ons op als het probleem blijft.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 mb-2">
                      Je ordernummer is <span className="font-semibold text-brand-blue">{payment.id}</span>.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Status: <span className="font-medium">{statusLabels[payment.status] ?? 'Onbekend'}</span>
                    </p>
                    <p className="text-gray-600 mb-6">
                      Bedrag: {payment.currency} {payment.amountValue}
                    </p>
                  </>
                )}
              </>
            ) : (
              <p className="text-gray-600">We laden je betaalgegevens...</p>
            )}
            <Link href="/hottubs" className="inline-flex items-center rounded-xl bg-brand-orange px-5 py-3 text-sm font-semibold text-white hover:bg-brand-orange/90">
              Verder winkelen
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
