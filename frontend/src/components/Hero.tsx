'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Truck, Award, Flame, Grid, Settings, Search, ShoppingBag, Phone, MessageCircle, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="py-3 sm:py-5 lg:py-12">
        <div className="container mx-auto px-4">
          {/* Mobile layout */}
          <div className="flex flex-col lg:hidden gap-3 sm:gap-4" >

            {/* Main heading - Mobile optimized typography */}
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-0.5 text-gray-900 font-sora pt-8">
              Luxe hottubs & sauna's
            </h1>
            
            <h2 className="text-xl sm:text-2xl font-medium mb-1 text-brand-orange">
              Kies, personaliseer & geniet
            </h2>
            
            <p className="text-gray-700 text-base sm:text-lg mb-3 max-w-xl">
            Al 6+ jaar specialist in maatwerk hottubs en sauna's — voor ultieme ontspanning, gewoon bij jou thuis.
            </p>

            {/* Image section */}
            <div className="relative mb-3">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img 
                  alt="Luxe hottub met houten afwerking" 
                  className="w-full h-auto object-cover aspect-[4/3]"
                  src="/assets/images/hero-background.jpg" 
                />
                
                {/* Overlay badges - Mobile optimized */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md text-xs font-medium">
                  20+ modellen beschikbaar
                </div>
                
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md text-xs font-medium whitespace-nowrap">
                  Brede keuze in materialen en extra's
                </div>
              </div>
            </div>

            {/* CTA buttons - Mobile optimized */}
            <div className="flex flex-col sm:flex-row gap-4 mb-1">
              <Link href="/hottubs" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-brand-orange text-white font-bold shadow-md rounded-md flex items-center justify-center gap-2 text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-brand-orange"
                >
                  Bekijk ons aanbod <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/contact" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto bg-white border border-brand-blue text-brand-blue font-bold shadow-md rounded-md flex items-center justify-center gap-2 text-base transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white"
                >
                  Stel een vraag <MessageCircle className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Microcopy under buttons - Mobile optimized */}
            <div className="hidden sm:flex items-center justify-start gap-8 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100">
                  <span className="text-xs">⏱</span>
                </span>
                <span>Vind jouw match in <span className="text-brand-orange font-medium">2 minuten</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100">
                  <Truck className="w-3 h-3" />
                </span>
                <span>Inclusief <span className="text-brand-orange font-medium">gratis</span> levering aan huis</span>
              </div>
            </div>

            {/* Feature points - Mobile optimized */}
            <div className="space-y-2 pt-4 pb-8">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-orange" />
                </div>
                <p className="text-gray-700 text-sm sm:text-base">Verwarmd zoals jij wilt: hout, elektrisch of hybride</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-orange" />
                </div>
                <p className="text-gray-700 text-sm sm:text-base">Persoonlijk advies van onze wellness-specialist</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                  <Grid className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-orange" />
                </div>
                <p className="text-gray-700 text-sm sm:text-base">Kies uit tientallen modellen, materialen en extra's</p>
              </div>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-center">
            {/* Left content area */}
            <div className="lg:col-span-6">
              {/* Trust indicator */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm">
                  Meer dan <span className="text-brand-orange font-medium">11000+</span> personen genieten al van hun persoonlijke spa
                </p>
              </div>

              {/* Main heading */}
              <h1 className="text-5xl font-bold leading-tight mb-2 text-gray-900 font-sora">
                Luxe hottubs & sauna's
              </h1>
              
              <h2 className="text-3xl font-medium mb-4 text-brand-orange">
                Kies, personaliseer & geniet
              </h2>
              
              <p className="text-gray-700 text-lg mb-6 max-w-xl">
              Al 6+ jaar specialist in maatwerk hottubs en sauna's — voor ultieme ontspanning, gewoon bij jou thuis.
              </p>
              
              {/* Feature points */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                    <Flame className="w-3.5 h-3.5 text-brand-orange" />
                  </div>
                  <p className="text-gray-700">Verwarmd zoals jij wilt: hout, elektrisch of hybride</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-3.5 h-3.5 text-brand-orange" />
                  </div>
                  <p className="text-gray-700">Persoonlijk advies van onze wellness-specialist</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                    <Grid className="w-3.5 h-3.5 text-brand-orange" />
                  </div>
                  <p className="text-gray-700">Kies uit tientallen modellen, materialen en extra's</p>
                </div>
              </div>
              
              {/* CTA buttons */}
              <div className="flex gap-4 mb-4">
                <Link href="/hottubs">
                  <Button 
                    size="lg" 
                    className="text-white shadow-md flex items-center justify-center gap-2 text-lg bg-brand-orange transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-brand-orange"
                  >
                    Bekijk ons aanbod <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                
                <Link href="/contact">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-brand-blue text-gray-800 flex items-center justify-center gap-2 text-base transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-white"
                  >
                    Stel een vraag <MessageCircle className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Microcopy under buttons */}
              <div className="flex items-center justify-start gap-8 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100">
                    <span className="text-xs">⏱</span>
                  </span>
                  <span>Vind jouw match in <span className="text-brand-orange font-medium">2 minuten</span></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100">
                    <Truck className="w-3 h-3" />
                  </span>
                  <span>Inclusief <span className="text-brand-orange font-medium">gratis</span> levering aan huis</span>
                </div>
              </div>
            </div>
            
            {/* Right image area */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img 
                  alt="Luxe hottub met houten afwerking" 
                  className="w-full h-auto object-cover"
                  src="/assets/images/hero-background.jpg" 
                />
                
                {/* Overlay badges */}
                <div className="absolute top-8 left-8 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md text-sm font-medium">
                  20+ modellen beschikbaar
                </div>
                
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md text-sm font-medium whitespace-nowrap">
                  Brede keuze in materialen en extra's
                </div>
              </div>

              {/* Authority indicators */}
              <div className="flex flex-wrap gap-2 mt-4 justify-end">
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-brand-blue" />
                  <span className="text-xs font-medium">2 jaar garantie</span>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 flex items-center gap-1.5">
                  <Ruler className="w-3 h-3 text-brand-blue" />
                  <span className="text-xs font-medium">Volledig op maat gemaakt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;