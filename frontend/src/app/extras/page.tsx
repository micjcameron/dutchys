import { Metadata } from 'next';
import ExtrasContent from './ExtrasContent';

export const metadata: Metadata = {
  title: "Extra's | Dutchy's Hot Tubs & Sauna's",
  description: "Accessoires en extra's voor jouw hottub. Voeg thermometers, hoofdsteunen en meer toe aan je bestelling.",
  keywords: "extra's, accessoires, hottub, wellness",
  openGraph: {
    title: "Extra's | Dutchy's Hot Tubs & Sauna's",
    description: "Accessoires en extra's voor jouw hottub. Voeg thermometers, hoofdsteunen en meer toe.",
    type: 'website',
    url: 'https://dutchys.nl/extras',
  },
};

export default function ExtrasPage() {
  return <ExtrasContent />;
}
