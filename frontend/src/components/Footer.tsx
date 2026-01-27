import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-brand-blue to-[#3A7D8C] text-white w-full">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center md:text-left">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <picture>
                <source srcSet="/logos/logo_dutchys_white.svg" type="image/svg+xml" />
                <img src="/logos/logo_dutchys_white.png" alt="Dutchy's logo wit" className="h-16 w-auto mx-auto md:mx-0" />
              </picture>
            </div>
            <p className="text-gray-300 mb-4 text-base">
              Wij zijn al 6+ jaar gespecialiseerd in handgemaakte hottubs en sauna's van de hoogste kwaliteit, voor jarenlang wellness-plezier.
            </p>
          </div>
          
          {/* Navigation */}
          <div>
            <h3 className="text-xl font-bold mb-4">Navigatie</h3>
            <ul className="space-y-2 flex flex-col items-center md:items-start text-base">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/hottubs" className="text-gray-300 hover:text-white">Hottubs</Link></li>
              <li><Link href="/saunas" className="text-gray-300 hover:text-white">Sauna's</Link></li>
              <li><Link href="/cold-plunge" className="text-gray-300 hover:text-white">Cold Plunge</Link></li>
              <li><Link href="/configurator" className="text-gray-300 hover:text-white">Configurator</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white">Over Ons</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <div className="space-y-4 flex flex-col items-center md:items-start text-base">
              <div className="flex items-center">
                <Phone size={20} className="mr-2 text-brand-orange flex-shrink-0" />
                <a href="tel:+31101234567" className="text-gray-300 hover:text-white">+31 (0)10 123 45 67</a>
              </div>
              <div className="flex items-center">
                <Mail size={20} className="mr-2 text-brand-orange flex-shrink-0" />
                <a href="mailto:info@dutchys.nl" className="text-gray-300 hover:text-white">info@dutchys.nl</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t-2 border-white mt-10 pt-6 w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
           <div className="w-full md:w-auto flex justify-center md:justify-start">
             <p className="text-gray-400 text-base text-center md:text-left">
            © {new Date().getFullYear()} Dutchy's Hot Tubs & Sauna's. Alle rechten voorbehouden.
          </p>
           </div>
           <div className="w-full md:w-auto flex flex-row flex-wrap justify-center md:justify-end gap-4 text-gray-400 text-sm md:text-base text-center md:text-right">
            <Link href="/privacy" className="hover:text-white">Privacybeleid</Link>
            <Link href="/voorwaarden" className="hover:text-white">Algemene Voorwaarden</Link>
            <Link href="/cookies" className="hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
