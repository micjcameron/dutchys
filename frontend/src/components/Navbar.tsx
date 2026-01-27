'use client';

import { useState, useEffect, memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Settings, Home, Info, Phone, Mail, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { motion, AnimatePresence } from 'framer-motion';
import { useCartCount } from '@/utils/useCartCount';

export type MenuItem = { name: string; href: string };

const Navbar = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const cartCount = useCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Hottubs', href: '/hottubs', icon: 'hottub' },
    { name: 'Configurator', href: '/configurator', icon: Settings },
    { name: 'Over Ons', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  const renderIcon = (icon: any) => {
    if (typeof icon === 'function') {
      const IconComponent = icon;
      return <IconComponent className="w-5 h-5 mr-2" />;
    }
    if (icon === 'hottub') {
      return <img src="/icons/hottub_icon_lightmode.png" alt="Hottubs" className="w-8 h-8 mr-2" />;
    }
    return null;
  };

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      {/* Mobile: white bar with logo and hamburger */}
      <div className={`md:hidden bg-white flex items-center justify-between px-4 py-3 border-b border-gray-200 shadow-sm sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <Link href="/" className="flex items-center">
          <img src="/logos/logo_dutchys.svg" alt="Dutchy's logo" className="h-10 w-auto" />
        </Link>
        <button
          className="relative w-10 h-10 flex items-center justify-center focus:outline-none group"
          aria-label={isMenuOpen ? 'Sluit menu' : 'Open menu'}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">{isMenuOpen ? 'Sluit menu' : 'Open menu'}</span>
          <span className="block absolute w-6 h-0.5 bg-brand-blue rounded transition-all duration-300 ease-in-out"
            style={{
              top: isMenuOpen ? '20px' : '14px',
              transform: isMenuOpen ? 'rotate(45deg)' : 'none',
            }}
          />
          <span className="block absolute w-6 h-0.5 bg-brand-blue rounded transition-all duration-300 ease-in-out"
            style={{
              top: '20px',
              opacity: isMenuOpen ? 0 : 1,
            }}
          />
          <span className="block absolute w-6 h-0.5 bg-brand-blue rounded transition-all duration-300 ease-in-out"
            style={{
              top: isMenuOpen ? '20px' : '26px',
              transform: isMenuOpen ? 'rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </div>

      {/* Main navigation - Desktop */}
      <nav className={`hidden md:block bg-gradient-to-r from-brand-blue/95 to-[#3A7D8C]/95 backdrop-blur-sm h-16 min-h-[56px] py-0 px-0 relative transition-all duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
        <div className="flex justify-between items-center h-full min-h-[56px] w-full">
          {/* Logo helemaal links */}
          <Link href="/" className="flex items-center h-full pl-6 pr-4 py-2">
            <img
              src="/logos/logo_dutchys_white.svg"
              alt="Dutchy's logo"
              className="object-contain w-auto max-h-full min-h-[36px]"
            />
          </Link>
          
          {/* Menu-items gecentreerd */}
          <div className="flex-1 flex justify-center items-center h-full">
            <NavigationMenu className="w-full justify-center h-full">
              <NavigationMenuList className="gap-1 h-full items-center">
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <Link href={item.href}>
                      <Button variant="ghost" className="bg-transparent text-white hover:bg-white/10 h-11 px-4 mx-0 my-[10px]">
                        {renderIcon(item.icon)}
                        <span className="text-sm">{item.name}</span>
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Winkelwagen button helemaal rechts */}
          <div className="flex items-center h-full pr-6 pl-4">
            <Link href="/cart">
              <Button variant="ghost" className="bg-brand-orange text-white hover:bg-brand-orange/90 h-11 px-4 mx-0 my-[10px]">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span className="text-sm">Winkelwagen ({cartCount})</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-0 left-0 h-full w-full bg-gradient-to-br from-brand-blue via-[#3A7D8C] to-[#4B9CB5] shadow-lg z-40"
            style={{ marginTop: 0 }}
          >
            <div className="pt-[64px] h-full flex flex-col">
              <div className="flex-1 overflow-y-auto px-4 pb-8">
                <nav className="flex flex-col gap-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 py-3 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {renderIcon(item.icon)}
                      <span className="text-lg font-medium text-brand-blue">{item.name}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

export default Navbar;
