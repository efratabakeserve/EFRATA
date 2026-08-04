import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  isDrinksMode: boolean;
  onExitDrinksMode: () => void;
  subcategories?: string[];
  activeSubcategory?: string;
  onSelectSubcategory?: (subcategory: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  isDrinksMode,
  onExitDrinksMode,
  subcategories,
  activeSubcategory,
  onSelectSubcategory,
}) => {
  const navRef = React.useRef<HTMLElement>(null);

  // Reset horizontal scroll when toggling between food and drinks category tabs
  // We use native scrollIntoView on target items to guarantee correct scroll alignment across mobile devices
  React.useEffect(() => {
    const resetScroll = () => {
      if (isDrinksMode) {
        const backBtn = document.getElementById('back-button-beverage');
        if (backBtn) {
          backBtn.scrollIntoView({ inline: 'start', block: 'nearest' });
        } else if (navRef.current) {
          navRef.current.scrollLeft = 0;
        }
      } else {
        const firstCat = document.getElementById('category-button-Recomendados');
        if (firstCat) {
          firstCat.scrollIntoView({ inline: 'start', block: 'nearest' });
        } else if (navRef.current) {
          navRef.current.scrollLeft = 0;
        }
      }
    };

    resetScroll();

    const t1 = setTimeout(resetScroll, 50);
    const t2 = setTimeout(resetScroll, 150);
    const t3 = setTimeout(resetScroll, 300);
    const t4 = setTimeout(resetScroll, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isDrinksMode]);

  return (
    <div className="sticky top-0 z-40 w-full bg-earth-sand/70 backdrop-blur-xl border-b border-earth-border/40 py-6 px-6 md:px-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col gap-1">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
          
          {/* Marca / Identidad */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="font-sans font-light text-[10px] uppercase tracking-[0.3em] text-earth-text-sec">
              El Sabor de los Buenos Momentos
            </span>
            <h1 className="font-sans font-bold text-2xl tracking-[0.15em] text-earth-clay uppercase mt-1">
              Efrata
            </h1>
          </div>

          {/* Categorías / Filtros */}
          <nav
            ref={navRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full py-1 px-4 sm:px-2"
          >
            <AnimatePresence mode="wait">
              {!isDrinksMode ? (
                <motion.div
                  key="main-categories"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 shrink-0"
                >
                  {categories.map((category) => {
                    const isActive = activeCategory === category;
                    return (
                      <button
                        key={category}
                        id={`category-button-${category}`}
                        onClick={() => onSelectCategory(category)}
                        className={`relative px-5 py-2 rounded-full font-sans text-[11px] font-medium uppercase tracking-[0.2em] transition-colors duration-500 cursor-pointer focus-visible:ring-1 focus-visible:ring-earth-olive focus:outline-none select-none ${
                          isActive ? 'text-earth-ivory' : 'text-earth-text-sec hover:text-earth-clay'
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeCategoryPill"
                            className="absolute inset-0 bg-earth-olive rounded-full -z-10"
                            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                          />
                        )}
                        <span className="relative z-10">{category}</span>
                      </button>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="drinks-subcategories"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 md:gap-3 shrink-0"
                >
                  {/* Botón Atrás */}
                  <button
                    id="back-button-beverage"
                    onClick={onExitDrinksMode}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-earth-terracotta bg-earth-terracotta/5 border border-earth-terracotta/20 hover:bg-earth-terracotta/10 transition-all duration-300 cursor-pointer focus:outline-none select-none mr-2"
                  >
                    <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Atrás</span>
                  </button>

                  <div className="w-[1px] h-6 bg-earth-border/40 mr-2 hidden sm:block" />

                  {/* Subcategorías de Bebidas */}
                  {subcategories && activeSubcategory && onSelectSubcategory && (
                    <div className="flex items-center gap-2 shrink-0">
                      {subcategories.map((sub) => {
                        const isActive = activeSubcategory === sub;
                        return (
                          <button
                            key={sub}
                            onClick={() => onSelectSubcategory(sub)}
                            className={`relative px-4 py-2 rounded-full font-sans text-[10px] font-medium uppercase tracking-[0.15em] transition-colors duration-300 cursor-pointer focus:outline-none select-none ${
                              isActive ? 'text-earth-clay font-semibold' : 'text-earth-text-sec hover:text-earth-clay'
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                layoutId="activeSubcategoryPill"
                                className="absolute inset-0 bg-earth-terracotta/10 border border-earth-terracotta/30 rounded-full -z-10"
                                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                              />
                            )}
                            <span className="relative z-10">{sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </div>
      </div>
    </div>
  );
};
