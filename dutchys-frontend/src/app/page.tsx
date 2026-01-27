'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductCategories from '@/components/ProductCategories';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header menu */}
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <Hero />
        
        {/* Categories */}
        <div className="mt-8">
          <ProductCategories />
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 