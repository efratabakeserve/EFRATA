import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Product {
  id: string;
  nombre: string;
  slogan_corto: string;
  imagen_url: string;
  categoria: string;
  etiquetas: string[];
  descripcion_emocional: string;
  ingredientes_clave: string[];
  informacion_nutricional: {
    calorias: number;
    proteina_g: number;
    carbohidratos_g: number;
    grasas_g: number;
  };
  alergenos: string[];
  maridaje_sugerido?: string;
  opciones?: string[];
}

const getProductImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const filename = url.split('/').pop() || '';
  try {
    return new URL(`../assets/${filename}`, import.meta.url).href;
  } catch (e) {
    console.error('Error loading image:', filename, e);
    return url;
  }
};

interface MenuGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ products, onSelectProduct }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 gap-y-16 gap-x-8 md:gap-x-12 lg:gap-x-20 items-start"
      >
        <AnimatePresence mode="popLayout">
          {products.map((product) => (
            <motion.div
              key={product.id}
              id={`product-card-${product.id}`}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-1 cursor-pointer group"
              onClick={() => onSelectProduct(product)}
            >
              <div className="flex flex-col gap-6">
                
                {/* Contenedor de Imagen con Efecto Hover Minimalista */}
                <div className="relative overflow-hidden aspect-[4/5] bg-earth-alabaster rounded-xs border border-earth-border/20 shadow-xs">
                  {/* Overlay sutil */}
                  <div className="absolute inset-0 bg-earth-clay/5 group-hover:bg-earth-clay/0 transition-colors duration-700 z-10" />
                  
                  {/* Imagen */}
                  <img
                    src={getProductImageUrl(product.imagen_url)}
                    alt={product.nombre}
                    className="w-full h-full object-cover transition-transform duration-[1.2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                  
                  {/* Categoría flotante */}
                  <span className="absolute top-6 left-6 font-sans font-light text-[9px] uppercase tracking-[0.25em] bg-earth-ivory/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-earth-clay z-15 border border-earth-border/10">
                    {product.categoria}
                  </span>
                </div>

                {/* Información Literaria del Producto */}
                <div className="flex flex-col gap-2 mt-2 px-1">
                  
                  {/* Etiquetas */}
                  <div className="flex flex-wrap gap-2">
                    {product.etiquetas.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-earth-terracotta"
                      >
                        · {tag}
                      </span>
                    ))}
                  </div>

                  {/* Nombre */}
                  <h3 className="font-sans font-extralight text-2xl tracking-[0.1em] text-earth-clay uppercase group-hover:text-earth-olive transition-colors duration-500 mt-1">
                    {product.nombre}
                  </h3>

                  {/* Slogan */}
                  <p className="font-serif italic text-[15px] text-earth-text-sec leading-relaxed mt-0.5 max-w-md">
                    {product.slogan_corto}
                  </p>
                  
                  {/* Indicador de detalle */}
                  <div className="mt-4 flex items-center gap-2 text-earth-olive opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-[-10px] group-hover:translate-x-0">
                    <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium">Descubrir perfil</span>
                    <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
