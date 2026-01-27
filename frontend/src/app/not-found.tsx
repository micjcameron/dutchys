import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 - Pagina niet gevonden</h1>
      <p className="text-gray-600 mb-8">
        De pagina die je zoekt bestaat niet of is verplaatst.
      </p>
      <Link href="/">
        <Button>Terug naar home</Button>
      </Link>
    </div>
  );
} 