'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createSession, updateSession } from '@/api/sessionApi';
import { getConfiguratorSessionId, setConfiguratorSessionId } from '@/utils/localStorage';

type ProductType = 'hottub' | 'sauna';

const ConfiguratorStart = () => {
  const router = useRouter();

  const handleStart = async (productType: ProductType, fallbackHref: string) => {
    try {
      let sessionId = getConfiguratorSessionId(productType);
      if (!sessionId) {
        const response = await createSession();
        sessionId = response.id;
        setConfiguratorSessionId(sessionId, productType);
      }
      if (!sessionId) {
        throw new Error('Session not available');
      }
      await updateSession(sessionId, { productType });
    } catch (error) {
      console.error('Failed to start configurator session:', error);
      router.push(fallbackHref);
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      <button
        type="button"
        onClick={() => handleStart('hottub', '/configurator/hottub')}
        className="text-left rounded-2xl bg-white shadow-lg p-6 border border-transparent hover:border-brand-orange transition-colors"
      >
        <h2 className="text-2xl font-semibold text-brand-blue mb-2">Hottub configurator</h2>
        <p className="text-gray-600 mb-4">Stel een hottub samen met vorm, verwarming, materialen en extra opties.</p>
        <span className="text-sm font-semibold text-brand-orange">Start hottub configurator →</span>
      </button>

      <button
        type="button"
        onClick={() => handleStart('sauna', '/configurator/sauna')}
        className="text-left rounded-2xl bg-white shadow-lg p-6 border border-transparent hover:border-brand-orange transition-colors"
      >
        <h2 className="text-2xl font-semibold text-brand-blue mb-2">Sauna configurator</h2>
        <p className="text-gray-600 mb-4">Binnenkort beschikbaar. Kies straks je sauna op maat.</p>
        <span className="text-sm font-semibold text-brand-orange">Bekijk sauna configurator →</span>
      </button>

      <div className="md:col-span-2 text-center text-xs text-gray-400">
        <Link href="/contact" className="hover:text-gray-600">Liever direct contact? Klik hier.</Link>
      </div>
    </div>
  );
};

export default ConfiguratorStart;
