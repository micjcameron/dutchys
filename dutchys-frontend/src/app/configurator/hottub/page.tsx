import { Metadata } from 'next';
import ProductConfigurator from '@/components/configurator/ProductConfigurator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Hottub Configurator | Dutchy\'s Hot Tubs & Sauna\'s',
  description: 'Stel uw droomhottub samen met onze configurator. Kies model, materialen, verwarming en extra opties.',
};

export default function HottubConfiguratorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <ProductConfigurator />
      </main>
      <Footer />
    </div>
  );
}
