import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ShieldCheck, Leaf, Compass, Feather } from 'lucide-react';

// Subcomponente para la animación de revelación de texto (Split Text por palabras)
interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const SplitText: React.FC<SplitTextProps> = ({ text, className = '', delay = 0 }) => {
  const words = text.split(' ');
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  };

  const childVariants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.span
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`inline-flex flex-wrap overflow-hidden ${className}`}
    >
      {words.map((word, idx) => (
        <span key={idx} className="relative overflow-hidden inline-block mr-[0.25em] py-1">
          <motion.span variants={childVariants} className="inline-block">
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
};

export const AboutSection: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const harvestRef = useRef<HTMLDivElement>(null);
  const alchemyRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);

  // 1. Control del color de fondo dinámico según el scroll en la sección Alquimia
  const { scrollYProgress: alchemyScroll } = useScroll({
    target: alchemyRef,
    offset: ['start end', 'end start'],
  });

  // Interpolación de colores HSL para la transición de color de fondo y texto (Estilo Sondaven)
  const backgroundColor = useTransform(
    alchemyScroll,
    [0, 0.25, 0.75, 1],
    ['#FAF5EF', '#A88A72', '#A88A72', '#FAF5EF']
  );
  
  const textColor = useTransform(
    alchemyScroll,
    [0, 0.25, 0.75, 1],
    ['#2B1E17', '#FFFFFF', '#FFFFFF', '#2B1E17']
  );

  const subtextColor = useTransform(
    alchemyScroll,
    [0, 0.25, 0.75, 1],
    ['#A88A72', '#F6CAA6', '#F6CAA6', '#A88A72']
  );

  const borderColor = useTransform(
    alchemyScroll,
    [0, 0.25, 0.75, 1],
    ['#F6CAA6', '#C0AC9B', '#C0AC9B', '#F6CAA6']
  );

  // 2. Control de la máscara (clipPath) y escala de la imagen de la cosecha
  const { scrollYProgress: harvestScroll } = useScroll({
    target: harvestRef,
    offset: ['start end', 'center center'],
  });

  const clipPathProgress = useTransform(harvestScroll, [0, 1], [100, 0]);
  const harvestClipPath = useTransform(clipPathProgress, (val) => `inset(${val}% 0% 0% 0%)`);
  
  const rawHarvestScale = useTransform(harvestScroll, [0, 1], [1.15, 1]);
  const harvestScale = useSpring(rawHarvestScale, { stiffness: 100, damping: 20 });

  // 3. Paralaje vertical para la sección del origen
  const { scrollYProgress: originScroll } = useScroll({
    target: originRef,
    offset: ['start end', 'end start'],
  });
  
  const rawParallaxY = useTransform(originScroll, [0, 1], [80, -80]);
  const parallaxY = useSpring(rawParallaxY, { stiffness: 100, damping: 25 });

  return (
    <motion.div ref={mainRef} className="w-full transition-colors duration-500">
      
      {/* 1. INTRODUCCIÓN HERO NARRATIVA */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 flex flex-col items-center">
        <div className="w-full max-w-4xl text-center flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3"
          >
            <Feather className="w-4 h-4 text-earth-terracotta" />
            <span className="font-sans font-light text-[11px] uppercase tracking-[0.3em] text-earth-terracotta">
              Filosofía & Alma
            </span>
          </motion.div>

          <SplitText
            text="El Arte del Fuego Lento"
            className="font-sans font-extralight text-4xl md:text-6xl uppercase tracking-[0.15em] text-earth-clay text-center"
            delay={0.1}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-serif italic text-lg md:text-2xl text-earth-olive leading-relaxed max-w-2xl mt-4"
          >
            “Elaboramos platos de confort con insumos orgánicos, fermentaciones de masa madre y extracciones lentas.”
          </motion.p>
        </div>
      </section>

      {/* 2. LA COSECHA (MÁSCARA CLIP-PATH DE IMAGEN - EFECTO SONDAVEN) */}
      <section ref={harvestRef} className="w-full bg-earth-alabaster/40 py-24 border-y border-earth-border/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 relative">
            {/* Contenedor de la máscara de scroll */}
            <motion.div
              style={{ clipPath: harvestClipPath }}
              className="relative aspect-[16/10] w-full overflow-hidden bg-earth-sand rounded-xs border border-earth-border/30 shadow-xs"
            >
              <motion.img
                style={{ scale: harvestScale }}
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1200&auto=format&fit=crop"
                alt="Cultivos y Cosecha Orgánica"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6 lg:pl-6">
            <span className="font-sans font-light text-[10px] uppercase tracking-[0.25em] text-earth-text-sec">
              01 / Insumos Locales
            </span>
            <h3 className="font-sans font-extralight text-3xl uppercase tracking-[0.1em] text-earth-clay">
              Materia Prima Honesta
            </h3>
            <p className="font-sans font-light text-sm text-earth-text-sec leading-relaxed">
              Colaboramos directamente con huertos orgánicos locales y granjas sostenibles. Desde los vegetales crujientes cosechados al amanecer hasta las carnes maduradas en seco, seleccionamos cada ingrediente respetando los ciclos naturales. Creemos que la cocina de confort nace de la integridad de cada insumo.
            </p>
            <div className="h-[1px] w-12 bg-earth-border/60 mt-2" />
          </div>

        </div>
      </section>

      {/* 3. LA ALQUIMIA (CAMBIO DE COLOR DE FONDO CON SCROLL - EFECTO SONDAVEN) */}
      <motion.section
        ref={alchemyRef}
        style={{ backgroundColor, color: textColor }}
        className="w-full py-32 transition-colors duration-700 relative"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col items-center gap-4">
            <span className="font-sans font-light text-[10px] uppercase tracking-[0.25em] text-earth-terracotta">
              02 / La Cocina
            </span>
            <h3 className="font-sans font-extralight text-4xl uppercase tracking-[0.15em]">
              Nuestra Filosofía Culinaria
            </h3>
            <motion.p 
              style={{ color: subtextColor }}
              className="font-serif italic text-[15px] leading-relaxed"
            >
              Cada receta combina técnicas artesanales clásicas con ingredientes naturales de primera calidad.
            </motion.p>
          </div>

          {/* Tarjetas Staggered con cambio de borde dinámico */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Pilar 1 */}
            <motion.div
              style={{ borderColor }}
              className="border p-8 md:p-10 flex flex-col gap-6 rounded-xs bg-transparent"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <Leaf className="w-6 h-6 text-earth-terracotta" />
              <h4 className="font-sans font-light text-lg uppercase tracking-[0.1em]">
                Masas Madre
              </h4>
              <motion.p
                style={{ color: subtextColor }}
                className="font-sans font-light text-[13px] leading-relaxed"
              >
                Nuestros panes brioche y bases de waffles belgas se fermentan lentamente durante 24 horas usando masa madre de centeno, garantizando una digestión ligera y una textura espectacular.
              </motion.p>
            </motion.div>

            {/* Pilar 2 */}
            <motion.div
              style={{ borderColor }}
              className="border p-8 md:p-10 flex flex-col gap-6 rounded-xs bg-transparent"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <Compass className="w-6 h-6 text-earth-terracotta" />
              <h4 className="font-sans font-light text-lg uppercase tracking-[0.1em]">
                Cero Ultraprocesados
              </h4>
              <motion.p
                style={{ color: subtextColor }}
                className="font-sans font-light text-[13px] leading-relaxed"
              >
                Elaboramos nuestros propios aderezos, salsas y encurtidos desde cero en nuestra cocina. Evitamos aceites hidrogenados, saborizantes artificiales y azúcares ultra-refinados.
              </motion.p>
            </motion.div>

            {/* Pilar 3 */}
            <motion.div
              style={{ borderColor }}
              className="border p-8 md:p-10 flex flex-col gap-6 rounded-xs bg-transparent"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.4 }}
            >
              <ShieldCheck className="w-6 h-6 text-earth-terracotta" />
              <h4 className="font-sans font-light text-lg uppercase tracking-[0.1em]">
                Café Especialidad
              </h4>
              <motion.p
                style={{ color: subtextColor }}
                className="font-sans font-light text-[13px] leading-relaxed"
              >
                Tratamos el café como una obra de arte líquido. Trabajamos con granos de origen único y especialidad, utilizando perfiles de tostado precisos y extracciones meticulosas de goteo lento.
              </motion.p>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* 4. EL ORIGEN (PARALAJE VERTICAL DE TEXTO VS IMAGEN) */}
      <section ref={originRef} className="max-w-7xl mx-auto px-6 md:px-12 py-32 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-5 flex flex-col gap-6">
            <span className="font-sans font-light text-[10px] uppercase tracking-[0.25em] text-earth-terracotta">
              03 / Origen
            </span>
            <h3 className="font-sans font-extralight text-3xl uppercase tracking-[0.1em] text-earth-clay">
              Nuestra Senda
            </h3>
            
            {/* Texto animado que se mueve a distinta velocidad (Efecto Paralaje) */}
            <motion.div style={{ y: parallaxY }} className="flex flex-col gap-6">
              <p className="font-sans font-light text-sm text-earth-text-sec leading-relaxed">
                Efrata nació del deseo de dignificar los clásicos de la cocina urbana y de confort. Nos cuestionamos si era posible elaborar una hamburguesa verdaderamente memorable o un waffle belga exquisito utilizando exclusivamente insumos limpios de pequeños productores y preparaciones hechas a mano.
              </p>
              <p className="font-sans font-light text-sm text-earth-text-sec leading-relaxed">
                Hoy fusionamos la indulgencia y rebeldía de estos bocados clásicos con el rigor del aprovisionamiento ecológico, ofreciendo un refugio gastronómico para el placer consciente.
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-7">
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-earth-alabaster rounded-xs border border-earth-border/20 shadow-xs">
              <img
                src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1200&auto=format&fit=crop"
                alt="Mezcla botánica y herbolaria"
                className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
              />
            </div>
          </div>

        </div>
      </section>

    </motion.div>
  );
};
