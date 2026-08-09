import { useState, useEffect } from 'react';
import menuData from './data/menuData.json';
import logo2 from './assets/LOGO (2).png';
import { FilterBar } from './components/FilterBar';
import { MenuGrid } from './components/MenuGrid';
import type { Product } from './components/MenuGrid';
import { ProductDrawer } from './components/ProductDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { SplashLoader } from './components/SplashLoader';
import { CotizacionesSection } from './components/CotizacionesSection';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Recomendados');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Asegurar que el scroll esté arriba una vez desmontada la pantalla de carga
  useEffect(() => {
    if (!showSplash) {
      window.scrollTo(0, 0);
    }
  }, [showSplash]);

  // Definir orden semántico y estricto de categorías sin "Nosotros"
  const categories = [
    'Recomendados',
    'Hamburguesas',
    'Perros',
    'Varios',
    'Dulces',
    'Bebidas',
    'Cotizaciones',
  ];

  const subcategories = [
    'Recomendados',
    'Sodas & Limonadas',
    'Malteadas',
    'Café',
    'Varios',
    'Postobón',
    'Cerveza',
  ];

  const [activeSubcategory, setActiveSubcategory] = useState('Recomendados');
  const [isDrinksMode, setIsDrinksMode] = useState(false);

  const scrollToMenu = () => {
    const element = document.getElementById('menu-content');
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (category: string) => {
    setActiveCategory(category);
    if (category === 'Bebidas') {
      setIsDrinksMode(true);
    } else {
      setIsDrinksMode(false);
    }
    scrollToMenu();
  };

  const handleExitDrinksMode = () => {
    setIsDrinksMode(false);
    setActiveCategory('Recomendados');
    setActiveSubcategory('Recomendados');
    scrollToMenu();
  };

  const handleSelectSubcategory = (sub: string) => {
    setActiveSubcategory(sub);
    scrollToMenu();
  };

  // Resetear subcategoría de bebidas cuando cambie la categoría principal
  useEffect(() => {
    if (activeCategory === 'Bebidas') {
      setActiveSubcategory('Recomendados');
    }
  }, [activeCategory]);

  const getDrinkSubcategory = (product: typeof menuData[0]) => {
    // Si la categoría asignada en el JSON es alguna de las subcategorías específicas, la retornamos
    if (['Café', 'Sodas & Limonadas', 'Malteadas', 'Postobón', 'Cerveza'].includes(product.categoria)) {
      return product.categoria;
    }
    // Si es del grupo de Bebidas en general o Varios (calientes/fríos), clasifica como 'Varios'
    return 'Varios';
  };

  const handleSelectPairing = (pairingName: string) => {
    const clean = (str: string) =>
      str.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");

    const cleanedTarget = clean(pairingName);
    const matchedProduct = menuData.find(p => clean(p.nombre) === cleanedTarget);
    if (!matchedProduct) return;

    setSelectedProduct(null);

    const drinkCategories = ['Bebidas', 'Café', 'Sodas & Limonadas', 'Malteadas', 'Postobón', 'Cerveza'];
    const isDrink = drinkCategories.includes(matchedProduct.categoria);

    if (isDrink) {
      setIsDrinksMode(true);
      setActiveCategory('Bebidas');
      setActiveSubcategory(getDrinkSubcategory(matchedProduct));
    } else {
      setIsDrinksMode(false);
      setActiveCategory(matchedProduct.categoria);
    }

    setTimeout(() => {
      const cardElement = document.getElementById(`product-card-${matchedProduct.id}`);
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setSelectedProduct(matchedProduct as any);
    }, 350);
  };

  // Filtrado de productos en tiempo real (mostrando destacados en "Recomendados")
  const filteredProducts = menuData.filter((p) => {
    const drinkCategories = ['Bebidas', 'Café', 'Sodas & Limonadas', 'Malteadas', 'Postobón', 'Cerveza'];
    const isDrink = drinkCategories.includes(p.categoria);

    if (activeCategory === 'Recomendados') {
      // Solo comida recomendada (nada de bebidas)
      return p.recomendado && !isDrink;
    }
    if (activeCategory === 'Bebidas') {
      if (!isDrink) return false;

      if (activeSubcategory === 'Recomendados') {
        return p.recomendado;
      }
      return getDrinkSubcategory(p) === activeSubcategory;
    }
    return p.categoria === activeCategory;
  });

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashLoader onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ delay: 0.1, duration: 0.8, ease: 'easeOut' }}
        className="min-h-screen bg-earth-sand flex flex-col selection:bg-earth-olive/10 selection:text-earth-olive"
      >
      
      {/* Sección Hero / Introducción Narrativa */}
      <header className="relative w-full overflow-hidden py-24 px-6 md:px-12 flex flex-col items-center justify-center text-center border-b border-earth-border/20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl flex flex-col items-center gap-6"
        >
          <img
            src={logo2}
            alt="Efrata Logo"
            className="w-full max-w-[280px] md:max-w-[340px] h-auto object-contain my-2"
          />
          
          <p className="font-serif italic text-lg md:text-xl text-earth-olive leading-relaxed max-w-xl">
            Sabores artesanales que despiertan sonrisas, creados con lo mejor de nuestra tierra. Descubre la magia de nuestras hamburguesas, la frescura de nuestras sodas y el abrazo de un café inolvidable.
          </p>

          <p className="font-sans font-light text-[11px] text-earth-text-sec tracking-[0.05em] max-w-md leading-relaxed mt-2">
            Explora nuestro menú interactivo: descubre la historia detrás de cada plato, las mezclas perfectas de sabor y elige...
          </p>
        </motion.div>
      </header>

      <div id="menu-start">
        <FilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          isDrinksMode={isDrinksMode}
          onExitDrinksMode={handleExitDrinksMode}
          subcategories={subcategories}
          activeSubcategory={activeSubcategory}
          onSelectSubcategory={handleSelectSubcategory}
        />
      </div>

      {/* Contenido Principal (Cuadrícula de Productos) */}
      <main id="menu-content" className="scroll-mt-28 flex-1 w-full max-w-7xl mx-auto pb-32">
        {activeCategory === 'Cotizaciones' ? (
          <CotizacionesSection />
        ) : (
          <MenuGrid products={filteredProducts} onSelectProduct={setSelectedProduct} />
        )}
      </main>

      {/* Panel Deslizable Interactivo (Drawer) */}
      <ProductDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectPairing={handleSelectPairing}
      />

      {/* Pie de Página Minimalista */}
      <footer className="w-full border-t border-earth-border/20 py-16 px-6 md:px-12 bg-earth-alabaster/40 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
          <span className="font-sans font-light text-[10px] uppercase tracking-[0.3em] text-earth-text-sec">
            Efrata © {new Date().getFullYear()} — El Sabor de los Buenos Momentos
          </span>
          <p className="font-sans font-light text-[11px] text-earth-text-sec max-w-md leading-relaxed">
            Nuestros platos son preparados artesanalmente al momento con insumos orgánicos locales de primera calidad. Consulta maridajes sugeridos y alérgenos en la ficha de cada plato.
          </p>
        </div>
      </footer>
      </motion.div>
    </>
  );
}

export default App;
