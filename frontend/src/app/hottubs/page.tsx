import { Metadata } from 'next';
import HottubsContent from './HottubsContent';

export const metadata: Metadata = {
  title: 'Hottubs | Dutchy\'s Hot Tubs & Sauna\'s',
  description: 'Ontdek onze collectie hoogwaardige hottubs. Perfect voor in de tuin, met verschillende modellen en verwarmingsopties. Vind de perfecte hottub voor uw buitenruimte.',
  keywords: 'hottub, hot tub, wellness, gezondheid, ontspanning, buiten wellness',
  openGraph: {
    title: 'Hottubs | Dutchy\'s Hot Tubs & Sauna\'s',
    description: 'Ontdek onze collectie hoogwaardige hottubs. Perfect voor in de tuin, met verschillende modellen en verwarmingsopties.',
    type: 'website',
    url: 'https://dutchys.nl/hottubs',
  },
};

export default function HottubsPage() {
  return <HottubsContent />;
} 