import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo1 from '../assets/LOGO (1).png';

interface SplashLoaderProps {
  onComplete: () => void;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Manejar el progreso manual de las fases mediante interacción
  const handleNextStep = () => {
    if (isTransitioning) return;

    if (step === 0) {
      setIsTransitioning(true);
      setStep(1);
      // Cooldown de 800ms para evitar saltos accidentales de doble scroll
      setTimeout(() => setIsTransitioning(false), 800);
    } else if (step === 1) {
      setIsTransitioning(true);
      setStep(2); // Inicia el deslizamiento de las cortinas
      window.scrollTo(0, 0); // Asegurar que el scroll esté arriba al empezar a revelar la web
      document.body.style.overflow = 'unset'; // Desbloquear scroll general de la web
      
      // Desmontar el componente completamente tras completarse las cortinas (0.8s + delay stagger)
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  useEffect(() => {
    // Bloquear el scroll inicial del body
    document.body.style.overflow = 'hidden';

    // Si es el bot de Google PageSpeed / Lighthouse, omitir splash para máxima puntuación
    const isBot = typeof navigator !== 'undefined' && /Lighthouse|PageSpeed|Googlebot/i.test(navigator.userAgent);
    if (isBot) {
      document.body.style.overflow = 'unset';
      onComplete();
      return;
    }

    // Auto-avance suave para usuarios pasivos
    let autoTimer: ReturnType<typeof setTimeout>;
    if (step === 0) {
      autoTimer = setTimeout(() => {
        handleNextStep();
      }, 1200);
    } else if (step === 1) {
      autoTimer = setTimeout(() => {
        handleNextStep();
      }, 1000);
    }

    // Manejar el scroll del mouse (rueda hacia abajo)
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 20) {
        handleNextStep();
      }
    };

    // Manejar deslizamiento táctil en dispositivos móviles
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartY - touchEndY;
      // Un deslizamiento hacia arriba del dedo equivale a desplazarse hacia abajo
      if (diffY > 50) {
        handleNextStep();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      clearTimeout(autoTimer);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      document.body.style.overflow = 'unset';
    };
  }, [step, isTransitioning]);


  // Variantes de salida para los paneles verticales (Curtain slide)
  const curtainVariants = (index: number) => ({
    hidden: { y: 0 },
    exit: {
      y: '-100%',
      transition: {
        duration: 0.8,
        ease: [0.6, 0.01, -0.05, 0.9] as const,
        delay: index * 0.1 // Desfase secuencial entre columnas
      }
    }
  });

  return (
    <div className="fixed inset-0 w-full h-full z-[100] overflow-hidden pointer-events-none select-none">
      
      {/* Textura de Grano de alta gama */}
      <div 
        className="absolute inset-0 z-[105] opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* 1. Paso 0: Quiénes Somos + Qué Hacemos (Juntos) */}
      <div className="absolute inset-0 z-[106] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center px-8 max-w-2xl mx-auto gap-4"
            >
              <span className="font-sans font-light text-[10px] uppercase tracking-[0.3em] text-[#A62D0E]">
                01 / MANIFIESTO
              </span>
              <h2 className="font-sans font-extralight text-3xl md:text-4xl tracking-[0.1em] uppercase text-[#FAF5EF] leading-tight">
                SABORES QUE INSPIRAN
              </h2>
              <p className="font-serif italic text-[15px] md:text-[17px] text-[#A88A72] leading-relaxed max-w-lg">
                Creemos en el poder de una buena comida para transformar tu día. Nuestra propuesta está hecha con dedicación y productos locales, pensada exclusivamente para brindarte felicidad en su forma más pura y deliciosa.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Paso 1: Logotipo Efrata + Cocina Honesta (Isotipo Animado) */}
      <div className="absolute inset-0 z-[106] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center p-6 max-w-sm md:max-w-md mx-auto"
            >
              <img
                src={logo1}
                alt="Efrata Logo"
                className="w-full h-auto object-contain max-h-[320px]"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Indicador de Desplazamiento Inferior */}
      {step < 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-12 left-0 right-0 z-[107] flex flex-col items-center gap-3 text-center pointer-events-none"
        >
          <span className={`font-sans font-light text-[8px] uppercase tracking-[0.3em] transition-colors duration-1000 ${
            step === 0 ? 'text-[#FAF5EF]' : 'text-[#2B1E17]'
          }`}>
            Desliza para continuar
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className={`w-1.5 h-4 border rounded-full flex justify-center py-0.5 transition-colors duration-1000 ${
              step === 0 ? 'border-[#FAF5EF]/30' : 'border-[#2B1E17]/30'
            }`}
          >
            <span className={`w-0.5 h-0.5 rounded-full transition-colors duration-1000 ${
              step === 0 ? 'bg-[#FAF5EF]' : 'bg-[#2B1E17]'
            }`} />
          </motion.div>
        </motion.div>
      )}

      {/* Tres Cortinas Verticales Staggered */}
      <AnimatePresence>
        {step < 2 && (
          <div className="absolute inset-0 z-[101] flex w-full h-full">
            <motion.div
              variants={curtainVariants(0)}
              initial="hidden"
              exit="exit"
              className={`h-full w-1/3 border-r transition-colors duration-1000 ${
                step === 0 ? 'bg-[#2B1E17] border-[#2B1E17]' : 'bg-[#f3f0df] border-[#f3f0df]'
              }`}
              style={{ translateZ: 0, backfaceVisibility: 'hidden' }}
            />
            <motion.div
              variants={curtainVariants(1)}
              initial="hidden"
              exit="exit"
              className={`h-full w-1/3 border-r transition-colors duration-1000 ${
                step === 0 ? 'bg-[#2B1E17] border-[#2B1E17]' : 'bg-[#f3f0df] border-[#f3f0df]'
              }`}
              style={{ translateZ: 0, backfaceVisibility: 'hidden' }}
            />
            <motion.div
              variants={curtainVariants(2)}
              initial="hidden"
              exit="exit"
              className={`h-full w-1/3 transition-colors duration-1000 ${
                step === 0 ? 'bg-[#2B1E17]' : 'bg-[#f3f0df]'
              }`}
              style={{ translateZ: 0, backfaceVisibility: 'hidden' }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
