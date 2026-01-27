'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

const categories = [
  {
    title: 'Hottubs',
    description: 'Ervaar ultieme ontspanning met onze premium hottubs. Kies uit 6 verschillende modellen, volledig op maat gemaakt naar jouw wensen en stijl. Perfect voor elk seizoen.',
    image: '/assets/images/hottub-main.jpg',
    link: '/hottubs',
    color: 'from-brand-blue/40 to-brand-blue/10',
    features: [
      'Houtgestookt, elektrisch of hybride',
      'Geïntegreerde of externe kachel',
      '6 verschillende modellen',
      'Uitgebreide keuze in houtsoorten en kleuren'
    ]
  }
];

const ProductCategories = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(0);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="w-full bg-neutral-100 py-12 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-sora font-bold text-gray-900 mb-4">
            Premium Hottubs
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ontdek onze premium hottubs, volledig op maat gemaakt voor jouw perfecte buitenruimte
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
          {categories.map((category, index) => (
            <Link href={category.link} key={index}>
              <motion.div 
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                {/* Image Container */}
                <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-b ${category.color} z-10 opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>
                  
                  <motion.img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover"
                    initial={{ scale: 1 }}
                    animate={{
                      scale: hoveredIndex === index ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.6 }}
                  />
                  
                  {/* Promo Badge */}
                  <div className="absolute top-6 left-6 z-20 bg-gradient-to-r from-brand-orange to-brand-orange/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-white" />
                    Tijdelijk gratis extras t.w.v. €350
                  </div>
                </div>
                
                {/* Content Container */}
                <div className="p-8">
                  <h3 className="text-2xl font-sora font-bold text-gray-900 mb-4 group-hover:text-brand-orange transition-colors">
                      {category.title}
                    </h3>
                  
                  <p className="text-gray-600 mb-6">
                      {category.description}
                    </p>
                  
                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {category.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA Button */}
                  <motion.div 
                    className="w-full"
                    animate={{ x: hoveredIndex === index ? 5 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      className="w-full bg-brand-orange text-white font-bold rounded-md shadow-md text-base py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg flex justify-center items-center gap-2"
                      tabIndex={0}
                    >
                      Zie onze hottubs
                      <ArrowRight size={20} className="ml-2" />
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
