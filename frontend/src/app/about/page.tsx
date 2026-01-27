import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 py-16 lg:py-20">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-brand-blue mb-4">Over Dutchy&apos;s</h1>
              <p className="text-gray-700 text-lg">
                Al 6+ jaar bouwen we maatwerk hottubs en sauna&apos;s die rust brengen in de
                drukte van alledag. Van de eerste schets tot de installatie bij jou thuis:
                alles draait om eenvoud, warmte en kwaliteit.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-brand-blue mb-2">Onze belofte</h2>
              <p className="text-gray-700">
                Jij kiest het model, het materiaal en de afwerking. Wij leveren een
                duurzame hottub die past bij jouw tuin en jouw ritme.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-brand-blue mb-2">Gemaakt op maat</h2>
              <p className="text-gray-700">
                Kies uit tientallen combinaties in houtsoorten, verwarming en extra&apos;s.
                Zo creëer je een spa-gevoel dat echt van jou is.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-brand-blue mb-2">Vertrouwd door velen</h2>
              <p className="text-gray-700">
                Meer dan 11.000+ mensen genieten al van een persoonlijke spa.
                We blijven bouwen op echte ervaringen en eerlijk advies.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-brand-blue/5">
          <div className="container mx-auto px-4 py-12 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-brand-blue mb-4">
                  Van idee tot ontspanning
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li>Persoonlijke keuzehulp en heldere configuratie.</li>
                  <li>Vakkundige productie met oog voor detail.</li>
                  <li>Levering aan huis en duidelijke instructies.</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-xl font-semibold text-brand-blue mb-3">Wat je van ons mag verwachten</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="font-semibold text-brand-blue mb-1">Transparant advies</p>
                    <p>We helpen je kiezen wat echt past.</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="font-semibold text-brand-blue mb-1">Kwaliteit & garantie</p>
                    <p>Materialen met lange levensduur.</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="font-semibold text-brand-blue mb-1">Snelle levering</p>
                    <p>Heldere planning, geen verrassingen.</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4">
                    <p className="font-semibold text-brand-blue mb-1">Service dichtbij</p>
                    <p>We staan klaar voor vragen.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 lg:py-16">
          <div className="rounded-2xl bg-gradient-to-r from-brand-blue to-[#3A7D8C] p-8 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Klaar voor jouw wellness-moment?</h2>
              <p className="text-white/90 max-w-2xl">
                Laat je adviseren of start direct met configureren. Samen maken we jouw ideale hottub werkelijkheid.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/configurator"
                className="inline-flex items-center justify-center rounded-md bg-white text-brand-blue px-5 py-2 font-semibold shadow-sm hover:bg-white/90"
              >
                Start configurator
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md border border-white/60 px-5 py-2 font-semibold text-white hover:bg-white/10"
              >
                Stel een vraag
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
