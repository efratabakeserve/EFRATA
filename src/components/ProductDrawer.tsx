import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ShieldAlert, ArrowLeft } from 'lucide-react';
import type { Product } from './MenuGrid';

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

interface ProductDrawerProps {
  product: Product | null;
  onClose: () => void;
  onSelectPairing?: (pairingProductName: string) => void;
  previousProduct?: Product | null;
  onDismissAll?: () => void;
}

export const ProductDrawer: React.FC<ProductDrawerProps> = ({
  product,
  onClose,
  onSelectPairing,
  previousProduct,
  onDismissAll,
}) => {
  // Cerrar al presionar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Bloquear el scroll del body cuando el panel está activo
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [product]);

  return (
    <AnimatePresence>
      {product && (
        <>
          {/* Fondo Translúcido / Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onDismissAll || onClose}
            className="fixed inset-0 z-50 bg-earth-clay/35 backdrop-blur-md cursor-pointer"
          />

          {/* Contenedor del Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-xl bg-earth-sand border-l border-earth-border/40 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Botón de Volver si hay producto anterior */}
            {previousProduct && (
              <div className="absolute top-6 left-6 z-30">
                <button
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-full bg-earth-ivory/90 backdrop-blur-md border border-earth-border/20 flex items-center gap-2 text-earth-clay hover:text-earth-olive hover:scale-105 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-earth-olive shadow-sm"
                  aria-label={`Volver a ${previousProduct.nombre}`}
                >
                  <ArrowLeft className="w-4 h-4 text-earth-terracotta" />
                  <span className="font-sans font-medium text-[11px] uppercase tracking-wider text-earth-clay">
                    Volver a {previousProduct.nombre}
                  </span>
                </button>
              </div>
            )}

            {/* Botón de Cierre Flotante (solo cuando no venimos de un maridaje) */}
            {!previousProduct && (
              <div className="absolute top-6 right-6 z-30">
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-earth-ivory/80 backdrop-blur-md border border-earth-border/20 flex items-center justify-center text-earth-clay hover:text-earth-olive hover:scale-105 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-earth-olive"
                  aria-label="Cerrar detalles"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Contenido Deslizable */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {/* Imagen con entrada suave */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-earth-alabaster">
                <motion.img
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  src={getProductImageUrl(product.imagen_url)}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Información de Narrativa */}
              <div className="px-8 md:px-12 pt-6 relative z-10">
                
                {/* Categoría y Título */}
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-light text-[10px] uppercase tracking-[0.25em] text-earth-terracotta">
                    {product.categoria}
                  </span>
                  <div className="flex justify-between items-baseline gap-4 mt-1">
                    <h2 className="font-sans font-bold text-3xl md:text-4xl tracking-[0.1em] text-earth-clay uppercase">
                      {product.nombre}
                    </h2>
                    {product.precios && product.precios.length > 1 ? (
                      <span className="font-sans font-semibold text-2xl md:text-3xl text-earth-terracotta whitespace-nowrap">
                        {(() => {
                          const sorted = [...product.precios].sort((a, b) => a - b);
                          return `$${sorted[0].toLocaleString('es-CO')} - $${sorted[sorted.length - 1].toLocaleString('es-CO')}`;
                        })()}
                      </span>
                    ) : product.precio && product.precio > 0 ? (
                      <span className="font-sans font-semibold text-2xl md:text-3xl text-earth-terracotta whitespace-nowrap">
                        ${product.precio.toLocaleString('es-CO')}
                      </span>
                    ) : null}
                  </div>

                  {/* Precio Con Papas */}
                  {product.precio_con_papas && product.precio_con_papas > 0 ? (
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-earth-border/20">
                      <span className="font-sans text-xs uppercase tracking-wider text-earth-text-sec">
                        Opción con Papas
                      </span>
                      <span className="font-sans font-semibold text-lg text-earth-terracotta">
                        ${product.precio_con_papas.toLocaleString('es-CO')}
                      </span>
                    </div>
                  ) : null}
                </div>

                {/* Slogan Poético (Solo se muestra si existe y no está vacío) */}
                {product.slogan_corto && (
                  <p className="font-serif italic text-lg text-earth-olive mt-5 leading-relaxed border-l-2 border-earth-olive/30 pl-4">
                    “{product.slogan_corto}”
                  </p>
                )}

                {/* Descripción Detallada (Solo se muestra si existe y no está vacía) */}
                {product.descripcion_emocional && (
                  <p className="font-sans font-normal text-[13.5px] text-earth-text-sec leading-relaxed mt-6">
                    {product.descripcion_emocional}
                  </p>
                )}

                {/* Ingredientes Principales (Solo se muestra si hay información) */}
                {product.ingredientes_clave && product.ingredientes_clave.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-earth-border/40">
                    <h4 className="font-sans font-normal text-xs uppercase tracking-[0.2em] text-earth-clay mb-4 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-earth-terracotta" />
                      Ingredientes Principales
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                      {product.ingredientes_clave.map((ingrediente) => (
                        <li key={ingrediente} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-earth-olive/40 mt-1.5 flex-shrink-0" />
                          <span className="font-sans font-normal text-xs text-earth-text-sec">
                            {ingrediente}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Maridaje Sugerido (Solo se muestra si existe) */}
                {product.maridaje_sugerido && (
                  <div className="mt-8 pt-8 border-t border-earth-border/40">
                    <h4 className="font-sans font-light text-xs uppercase tracking-[0.2em] text-earth-clay mb-3">
                      Maridaje Sugerido
                    </h4>
                    <div className="font-serif italic text-[15px] text-earth-olive leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-2.5">
                      <span>Te sugerimos acompañar este plato con:</span>
                      {product.maridaje_sugerido
                        .split(',')
                        .map((p) => p.trim())
                        .filter(Boolean)
                        .map((pairing) => (
                          <button
                            key={pairing}
                            onClick={() => onSelectPairing?.(pairing)}
                            className="font-sans font-medium not-italic text-[10px] text-earth-terracotta tracking-[0.12em] uppercase bg-earth-terracotta/5 border border-earth-terracotta/20 hover:bg-earth-terracotta/10 px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-earth-terracotta whitespace-nowrap inline-flex items-center"
                          >
                            {pairing}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Opciones Disponibles (Solo se muestra si el producto tiene opciones configuradas) */}
                {product.opciones && product.opciones.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-earth-border/40">
                    <h4 className="font-sans font-light text-xs uppercase tracking-[0.2em] text-earth-clay mb-4">
                      Opciones Disponibles
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.opciones.map((opcion, index) => {
                        const price = product.precios && product.precios[index];
                        return (
                          <span
                            key={opcion}
                            className="font-sans font-medium text-[10px] text-earth-text-sec tracking-[0.1em] uppercase bg-earth-alabaster border border-earth-border/20 px-3 py-1.5 rounded-full"
                          >
                            {opcion} {price ? `($${price.toLocaleString('es-CO')})` : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tabla de Nutrientes (Solo se muestra si hay un perfil nutricional configurado) */}
                {product.informacion_nutricional && product.informacion_nutricional.calorias > 0 && (
                  <div className="mt-8 pt-8 border-t border-earth-border/40">
                    <div className="flex items-baseline justify-between mb-6">
                      <h4 className="font-sans font-normal text-xs uppercase tracking-[0.2em] text-earth-clay">
                        Perfil Nutricional
                      </h4>
                      <div className="text-right">
                        <span className="font-sans font-extralight text-5xl tracking-tight text-earth-clay">
                          {product.informacion_nutricional.calorias}
                        </span>
                        <span className="font-sans font-normal text-[10px] uppercase tracking-[0.2em] text-earth-text-sec ml-2">
                          KCAL
                        </span>
                      </div>
                    </div>

                    {/* Macronutrientes (Gráficos minimalistas) */}
                    <div className="flex flex-col gap-5">
                      
                      {/* Proteínas */}
                      <div>
                        <div className="flex justify-between text-xs font-sans text-earth-text-sec mb-1.5">
                          <span className="font-normal">Proteína</span>
                          <span className="font-medium text-earth-clay">{product.informacion_nutricional.proteina_g}g</span>
                        </div>
                        <div className="w-full h-1.5 bg-earth-alabaster rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (product.informacion_nutricional.proteina_g / 25) * 100)}%` }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full bg-earth-olive rounded-full"
                          />
                        </div>
                      </div>

                      {/* Carbohidratos */}
                      <div>
                        <div className="flex justify-between text-xs font-sans text-earth-text-sec mb-1.5">
                          <span className="font-normal">Carbohidratos</span>
                          <span className="font-medium text-earth-clay">{product.informacion_nutricional.carbohidratos_g}g</span>
                        </div>
                        <div className="w-full h-1.5 bg-earth-alabaster rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (product.informacion_nutricional.carbohidratos_g / 40) * 100)}%` }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full bg-earth-terracotta rounded-full"
                          />
                        </div>
                      </div>

                      {/* Grasas */}
                      <div>
                        <div className="flex justify-between text-xs font-sans text-earth-text-sec mb-1.5">
                          <span className="font-normal">Grasas Saludables</span>
                          <span className="font-medium text-earth-clay">{product.informacion_nutricional.grasas_g}g</span>
                        </div>
                        <div className="w-full h-1.5 bg-earth-alabaster rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (product.informacion_nutricional.grasas_g / 25) * 100)}%` }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full bg-earth-sage rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Declaración de Alérgenos (Solo se muestra si hay alérgenos configurados) */}
                {product.alergenos && product.alergenos.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-earth-border/40">
                    <h4 className="font-sans font-normal text-xs uppercase tracking-[0.2em] text-earth-clay mb-4">
                      Especificación de Alérgenos
                    </h4>
                    <div className="bg-earth-alabaster/40 border border-earth-border/50 p-4 rounded-xs flex items-start gap-3.5">
                      <ShieldAlert className="w-4.5 h-4.5 text-earth-terracotta mt-0.5 flex-shrink-0" />
                      <div className="flex flex-col gap-1">
                        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.1em] text-earth-clay">
                          Contiene alérgenos declarados:
                        </span>
                        <p className="font-sans font-normal text-xs text-earth-text-sec leading-relaxed">
                          Este lote contiene <strong className="text-earth-clay font-medium">{product.alergenos.join(', ')}</strong>. Puede contener trazas residuales de otros frutos secos o semillas debido a métodos artesanales de molienda.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
