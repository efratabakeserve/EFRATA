import React from 'react';
import { motion } from 'framer-motion';
import { Send, Coffee } from 'lucide-react';
import logoCotizaciones from '../assets/logo-cotizaciones.png';

// PEGA AQUÍ TU ENLACE DE WHATSAPP COMPLETO (ej: de wa.link, wa.me/tel, etc.)
const WHATSAPP_LINK = 'https://wa.me/message/NLSQJKQWH2HVO1';

export const CotizacionesSection: React.FC = () => {

  const handleWhatsappRedirect = () => {
    window.open(WHATSAPP_LINK, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-xl mx-auto my-12 px-6 text-center flex flex-col items-center gap-8"
    >
      {/* Encabezado */}
      <div className="flex flex-col items-center">
        <span className="font-sans font-normal text-[10px] uppercase tracking-[0.3em] text-earth-terracotta flex items-center justify-center gap-2 mb-4">
          <Coffee className="w-3.5 h-3.5" /> Efrata Eventos & Catering
        </span>
        
        {/* Contenedor del Logo de Cotizaciones */}
        <div className="w-full max-w-[260px] md:max-w-[300px] aspect-video flex items-center justify-center p-4 rounded-2xl bg-white/40 border border-earth-border/10 shadow-sm mb-6 hover:scale-[1.02] transition-transform duration-500">
          <img
            src={logoCotizaciones}
            alt="Logo Cotizaciones Efrata"
            className="w-full h-full object-contain"
          />
        </div>

        <h2 className="font-sans font-extralight text-3xl md:text-4xl text-earth-clay uppercase tracking-[0.1em] mb-4">
          Cotizaciones Especiales
        </h2>
        
        <p className="font-serif italic text-base text-earth-olive leading-relaxed max-w-md mx-auto">
          “Comparte momentos inolvidables. Llevamos el sabor artesanal de Efrata a tus reuniones familiares, corporativas o cumpleaños.”
        </p>
      </div>

      {/* Botón único de WhatsApp */}
      <motion.button
        onClick={handleWhatsappRedirect}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-center gap-3 px-10 py-4.5 rounded-full bg-earth-terracotta text-earth-ivory font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-earth-terracotta-light transition-all duration-300 cursor-pointer shadow-lg shadow-earth-terracotta/10 focus:outline-none select-none touch-manipulation"
      >
        <Send className="w-4 h-4" />
        Cotizar por WhatsApp
      </motion.button>
    </motion.div>
  );
};
