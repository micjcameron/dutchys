import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function IdealPlaceholderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-20">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-brand-blue mb-3">Betaalpagina komt eraan</h1>
            <p className="text-gray-600 mb-6">
              We sturen je zo direct door naar de iDEAL betaalomgeving. Dit is nu nog een placeholder.
            </p>
            <Link href="/cart">
              <Button className="bg-brand-orange text-white hover:bg-brand-orange/90">
                Terug naar winkelwagen
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
