'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { submitContactForm } from '@/api/communicationApi';

export default function ContactPage() {
  const searchParams = useSearchParams();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const prefillMessage = searchParams.get('message');
    if (prefillMessage) {
      setFormState((prev) => ({
        ...prev,
        message: prev.message ? prev.message : prefillMessage,
      }));
    }
  }, [searchParams]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setStatusMessage('');
    try {
      await submitContactForm({
        name: formState.name.trim(),
        email: formState.email.trim(),
        phone: formState.phone.trim() || undefined,
        message: formState.message.trim(),
      });
      setStatusMessage('Bedankt! Je bericht is verzonden. We nemen snel contact met je op.');
      setFormState({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setStatusMessage('Er ging iets mis. Probeer het later opnieuw.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold text-brand-blue mb-4">Contact</h1>
              <p className="text-gray-700 text-lg mb-6">
                Heb je vragen over modellen, levering of maatwerk? Laat het ons weten — we
                reageren snel en persoonlijk.
              </p>
              <div className="space-y-4 text-gray-700">
                <div>
                  <p className="font-semibold text-brand-blue">Telefoon</p>
                  <p>+31 (0)10 123 45 67</p>
                </div>
                <div>
                  <p className="font-semibold text-brand-blue">E-mail</p>
                  <p>info@dutchys.nl</p>
                </div>
                <div>
                  <p className="font-semibold text-brand-blue">Openingstijden</p>
                  <p>Ma - Vr: 09:00 - 17:30</p>
                  <p>Za: 10:00 - 15:00</p>
                </div>
                <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-6">
                  <p className="font-semibold text-brand-blue mb-2">Bezoek op afspraak</p>
                  <p className="text-gray-700">
                    Plan een bezoek en ervaar onze hottubs en materialen in het echt.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-semibold text-brand-blue mb-6">Stuur ons een bericht</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                    Naam
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-brand-orange focus:outline-none"
                    placeholder="Jouw naam"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    E-mailadres
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-brand-orange focus:outline-none"
                    placeholder="jij@voorbeeld.nl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
                    Telefoon
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:border-brand-orange focus:outline-none"
                    placeholder="+31 6 12345678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                    Bericht
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formState.message}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 px-4 py-2 min-h-[140px] focus:border-brand-orange focus:outline-none"
                    placeholder="Vertel ons waar je naar op zoek bent..."
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand-orange text-white hover:bg-brand-orange/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Versturen...' : 'Verstuur bericht'}
                </Button>
                {statusMessage && (
                  <p
                    className={`text-sm ${statusMessage.startsWith('Bedankt') ? 'text-green-600' : 'text-red-600'}`}
                    role="status"
                  >
                    {statusMessage}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Door te verzenden ga je akkoord dat we je bericht verwerken.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
