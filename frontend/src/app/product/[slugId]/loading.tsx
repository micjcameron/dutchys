export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-brand-orange/30 border-t-brand-orange animate-spin" />
        <div className="text-sm text-gray-500">Product laden...</div>
      </div>
    </div>
  );
}
