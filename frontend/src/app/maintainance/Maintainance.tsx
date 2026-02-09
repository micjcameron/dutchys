export default function MaintenancePage() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-xl rounded-2xl border border-gray-100 bg-white/90 p-10 text-center shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            Onderhoud
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-brand-blue sm:text-4xl">
            Momenteel in onderhoud
          </h1>
          <p className="mt-4 text-base text-gray-600">
            We voeren op dit moment updates uit. Kom later nog eens terug.
          </p>
        </div>
      </div>
    );
  }
  