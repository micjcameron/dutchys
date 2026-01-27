import type { Metadata } from 'next';
import SaunasContent from './SaunasContent';

export const metadata: Metadata = {
  title: "Sauna's | Dutchy's Hot Tubs & Sauna's",
  description: "Ontdek onze collectie sauna's voor thuis en buiten.",
  openGraph: {
    title: "Sauna's | Dutchy's Hot Tubs & Sauna's",
    description: "Ontdek onze collectie sauna's voor thuis en buiten.",
  },
};

export default function SaunasPage() {
  return <SaunasContent />;
}
