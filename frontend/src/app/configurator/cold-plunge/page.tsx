import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: "Cold Plunge Configurator | Dutchy's Hot Tubs & Sauna's",
  description: 'De cold plunge configurator komt eraan. Neem contact op voor maatwerk.',
};

export default function ColdPlungeConfiguratorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-20">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-brand-blue mb-3">Cold plunge configurator komt eraan</h1>
            <p className="text-gray-600 mb-6">
              We bouwen op dit moment aan de cold plunge configurator. Neem contact op voor advies op maat.
            </p>
            <Link href="/contact">
              <Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
                Neem contact op
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
