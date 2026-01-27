'use client';

import { useState } from 'react';
import type { MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  className?: string;
}

const ImagePreview = ({ src, alt, className = '' }: ImagePreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        className={`relative overflow-hidden rounded-lg cursor-zoom-in ${className}`}
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(true);
        }}
        aria-label="Vergroot afbeelding"
      >
        <Image
          src={src}
          alt={alt}
          width={80}
          height={60}
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              className="relative max-w-2xl max-h-[60vh] mx-4"
              onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                width={400}
                height={300}
                className="object-contain rounded-lg shadow-2xl"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                aria-label="Sluit voorbeeld"
              >
                <X className="w-5 h-5 text-gray-800" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImagePreview;
