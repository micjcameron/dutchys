import { Metadata } from 'next';
import ConfiguratorStart from '@/components/configurator/ConfiguratorStart';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Configurator | Dutchy\'s Hot Tubs & Sauna\'s',
  description: 'Kies het type product dat u wilt configureren en start direct met samenstellen.',
};

export default function ConfiguratorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-blue mb-3">Kies je configurator</h1>
            <p className="text-gray-600">Start met het samenstellen van jouw perfecte hottub of sauna.</p>
          </div>

          <ConfiguratorStart />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
