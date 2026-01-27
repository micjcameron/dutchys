import type { Metadata } from 'next';
import ColdPlungeContent from './ColdPlungeContent';

export const metadata: Metadata = {
  title: "Cold Plunge | Dutchy's Hot Tubs & Sauna's",
  description: 'Ontdek onze cold plunge collectie voor herstel en wellness.',
  openGraph: {
    title: "Cold Plunge | Dutchy's Hot Tubs & Sauna's",
    description: 'Ontdek onze cold plunge collectie voor herstel en wellness.',
  },
};

export default function ColdPlungePage() {
  return <ColdPlungeContent />;
}
