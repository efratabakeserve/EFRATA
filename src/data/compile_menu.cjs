const fs = require('fs');
const path = require('path');

const mdPath = 'c:/Users/velpe/OneDrive/Documentos/ANTIGRAVITY/EFRATA/PRODUCTOS_EFRATA.md';
const jsonPath = 'c:/Users/velpe/OneDrive/Documentos/ANTIGRAVITY/EFRATA/src/data/menuData.json';
const assetsDir = 'c:/Users/velpe/OneDrive/Documentos/ANTIGRAVITY/EFRATA/src/assets';

// Read existing JSON to preserve IDs, nutrition info, and old image URLs
let oldMenu = [];
try {
  oldMenu = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
} catch (e) {
  console.log("Error reading old JSON, will proceed without it:", e);
}

// Map old menu by normalized name for easy lookups
const oldMenuByName = {};
oldMenu.forEach(p => {
  const normName = p.nombre.toLowerCase().trim();
  oldMenuByName[normName] = p;
});

// Read files in src/assets
let assetFiles = [];
try {
  assetFiles = fs.readdirSync(assetsDir);
} catch (e) {
  console.log("Error reading assets dir:", e);
}

// Helper to normalize strings for comparison
function cleanStr(str) {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]/g, "");     // remove non-alphanumeric
}

// Find local image asset for product name
function findLocalImage(productName) {
  const nameLower = productName.toLowerCase().trim();
  
  // Special hardcoded checks/mappings
  if (nameLower === "croissant mantequilla" || nameLower === "croissant") {
    const f = assetFiles.find(file => cleanStr(path.parse(file).name) === "croissant");
    if (f) return `/src/assets/${f}`;
  }
  if (nameLower.includes("croissant salado-verde aroma") || nameLower === "verde aroma") {
    const f = assetFiles.find(file => cleanStr(file).includes("croassantsaladoverdearoma"));
    if (f) return `/src/assets/${f}`;
  }
  if (nameLower.includes("croissant dulce-chocoso") || nameLower === "chocoso") {
    const f = assetFiles.find(file => cleanStr(file).includes("croassantdulcechocoso"));
    if (f) return `/src/assets/${f}`;
  }
  if (nameLower === "mola" || nameLower === "moka") {
    const f = assetFiles.find(file => cleanStr(file).includes("moka"));
    if (f) return `/src/assets/${f}`;
  }

  const cleanedName = cleanStr(productName);

  // Match logic:
  // 1. Split filename by hyphen to separate category prefix (e.g. 'hamburguesa-EFRATA' -> 'EFRATA')
  // 2. Compare cleaned product name with the extracted product part
  for (const file of assetFiles) {
    const nameWithoutExt = path.parse(file).name;
    const parts = nameWithoutExt.split('-');
    const productPart = parts.length > 1 ? parts[parts.length - 1] : nameWithoutExt;
    
    if (cleanStr(productPart) === cleanedName) {
      return `/src/assets/${file}`;
    }
  }
  
  return null;
}

// Helper to generate a slug id
function slugify(text) {
  return text.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Parse PRODUCTOS_EFRATA.md
const content = fs.readFileSync(mdPath, 'utf8');
const lines = content.split('\n');

const products = [];
let currentCategory = '';
let inBebidas = false;
let currentProduct = null;

// Categories map
function mapCategory(rawCat) {
  const cat = rawCat.toUpperCase();
  if (cat.includes('HAMBURGUESAS')) return 'Hamburguesas';
  if (cat.includes('PERROS')) return 'Perros';
  if (cat.includes('VARIOS / ENTRADAS')) return 'Varios';
  if (cat.includes('DULCES') || cat.includes('POSTRES')) return 'Dulces';
  if (cat.includes('CAFÉ') || cat.includes('CAFE')) return 'Café';
  if (cat.includes('VARIOS')) {
    return inBebidas ? 'Bebidas' : 'Varios';
  }
  if (cat.includes('SODAS') || cat.includes('LIMONADAS')) return 'Sodas & Limonadas';
  if (cat.includes('MALTEADAS')) return 'Malteadas';
  if (cat.includes('POSTOBON')) return 'Postobón';
  if (cat.includes('CERVEZA')) return 'Cerveza';
  return rawCat; // fallback
}

for (let line of lines) {
  line = line.trim();
  if (!line) continue;

  // Check if we entered BEBIDAS section
  if (line.match(/^#\s*BEBIDAS:/i)) {
    inBebidas = true;
    continue;
  }

  if (line.startsWith('###')) {
    // Parse Product heading
    const prodMatch = line.match(/^###\s*PRODUCTO:\s*(.*)$/i);
    if (prodMatch) {
      if (currentProduct) {
        products.push(currentProduct);
      }
      currentProduct = {
        nombre: prodMatch[1].trim(),
        slogan_corto: "",
        descripcion_emocional: "",
        ingredientes_clave: [],
        maridaje_sugerido: "",
        etiquetas: [],
        alergenos: [],
        opciones: [],
        informacion_nutricional: {
          calorias: 0,
          proteina_g: 0,
          carbohidratos_g: 0,
          grasas_g: 0
        },
        recomendado: false,
        categoria: currentCategory
      };
    }
    continue;
  }

  if (line.startsWith('##')) {
    // Parse Category heading
    const catMatch = line.match(/^##\s*(?:.*CATEGORÍA:)?\s*(.*)$/i);
    if (catMatch) {
      let rawCat = catMatch[1].trim();
      currentCategory = mapCategory(rawCat);
    }
    continue;
  }

  if (!currentProduct) continue;

  // Parse fields
  const esloganMatch = line.match(/^\-\s*\*\*Eslogan corto:\*\*\s*(.*)$/i);
  if (esloganMatch) {
    currentProduct.slogan_corto = esloganMatch[1].trim();
    continue;
  }

  const descMatch = line.match(/^\-\s*\*\*Descripción emocional:\*\*\s*(.*)$/i);
  if (descMatch) {
    currentProduct.descripcion_emocional = descMatch[1].trim();
    continue;
  }

  const ingMatch = line.match(/^\-\s*\*\*Ingredientes clave:\*\*\s*(.*)$/i);
  if (ingMatch) {
    currentProduct.ingredientes_clave = ingMatch[1].split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.replace(/^\.*/, '').replace(/\.*$/, '')); // clean trailing dots
    continue;
  }

  const marMatch = line.match(/^\-\s*\*\*Maridaje sugerido:\*\*\s*(.*)$/i);
  if (marMatch) {
    currentProduct.maridaje_sugerido = marMatch[1].trim();
    continue;
  }

  const tagMatch = line.match(/^\-\s*\*\*Etiquetas:\*\*\s*(.*)$/i);
  if (tagMatch) {
    currentProduct.etiquetas = tagMatch[1].split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.replace(/^\.*/, '').replace(/\.*$/, ''));
    continue;
  }

  const aleMatch = line.match(/^\-\s*\*\*Alérgenos:\*\*\s*(.*)$/i);
  if (aleMatch) {
    currentProduct.alergenos = aleMatch[1].split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.replace(/^\.*/, '').replace(/\.*$/, ''));
    if (currentProduct.alergenos.length === 1 && currentProduct.alergenos[0].toLowerCase() === 'ninguno') {
      currentProduct.alergenos = [];
    }
    continue;
  }

  const opcionesMatch = line.match(/^\-\s*\*\*Opciones:\*\*\s*(.*)$/i);
  if (opcionesMatch) {
    currentProduct.opciones = opcionesMatch[1].split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.replace(/^\.*/, '').replace(/\.*$/, ''));
    continue;
  }

  // Parse nutritional fields if present
  const calMatch = line.match(/^\-\s*\*\*Calorias:\*\*\s*(\d+)/i);
  if (calMatch) {
    currentProduct.informacion_nutricional.calorias = parseInt(calMatch[1], 10);
    continue;
  }

  const protMatch = line.match(/^\-\s*\*\*Proteinas:\*\*\s*(\d+)/i);
  if (protMatch) {
    currentProduct.informacion_nutricional.proteina_g = parseInt(protMatch[1], 10);
    continue;
  }

  const carbMatch = line.match(/^\-\s*\*\*Carbohidratos:\*\*\s*(\d+)/i);
  if (carbMatch) {
    currentProduct.informacion_nutricional.carbohidratos_g = parseInt(carbMatch[1], 10);
    continue;
  }

  const grasMatch = line.match(/^\-\s*\*\*Grasas:\*\*\s*(\d+)/i);
  if (grasMatch) {
    currentProduct.informacion_nutricional.grasas_g = parseInt(grasMatch[1], 10);
    continue;
  }

  const recMatch = line.match(/^\-\s*\*\*Recomendado por la casa\s*\(Sí\/No\):\*\*\s*(.*)$/i);
  if (recMatch) {
    const val = recMatch[1].trim().toLowerCase();
    currentProduct.recomendado = val.startsWith('sí') || val.startsWith('si');
    continue;
  }
}

// Push last product
if (currentProduct) {
  products.push(currentProduct);
}

// Default images by category
const categoryDefaults = {
  'Hamburguesas': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
  'Perros': 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?q=80&w=1200&auto=format&fit=crop',
  'Varios': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop',
  'Dulces': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=1200&auto=format&fit=crop',
  'Café': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1200&auto=format&fit=crop',
  'Bebidas': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1200&auto=format&fit=crop',
  'Sodas & Limonadas': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
  'Malteadas': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
  'Postobón': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
  'Cerveza': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop'
};

// Merge and enhance parsed products
const finalProducts = products.map(p => {
  // Correct MOLA -> MOKA
  if (p.nombre === "MOLA") {
    p.nombre = "MOKA";
  }
  // Correct MATEADA OREO -> MALTEADA OREO
  if (p.nombre === "MATEADA OREO") {
    p.nombre = "MALTEADA OREO";
  }

  const normName = p.nombre.toLowerCase().trim();
  const old = oldMenuByName[normName] || oldMenuByName[normName === 'moka' ? 'mola' : ''] || {};

  // Preserve ID or slugify
  const id = old.id || slugify(p.nombre);

  // Preserve nutrition info if it was read from markdown, otherwise fallback to old JSON values
  const proteina_g = p.informacion_nutricional.proteina_g || old.informacion_nutricional?.proteina_g || 0;
  const carbohidratos_g = p.informacion_nutricional.carbohidratos_g || old.informacion_nutricional?.carbohidratos_g || 0;
  const grasas_g = p.informacion_nutricional.grasas_g || old.informacion_nutricional?.grasas_g || 0;
  
  // Calculate approximate calories dynamically using standard Atwater values if macros are present but calories are not
  let calorias = p.informacion_nutricional.calorias || old.informacion_nutricional?.calorias || 0;
  if (calorias === 0 && (proteina_g > 0 || carbohidratos_g > 0 || grasas_g > 0)) {
    calorias = (proteina_g * 4) + (carbohidratos_g * 4) + (grasas_g * 9);
  }

  const informacion_nutricional = {
    calorias,
    proteina_g,
    carbohidratos_g,
    grasas_g
  };

  // Determine image URL:
  // 1. Try to find a local match in src/assets
  // 2. If not found, try to preserve old image_url (ONLY if it is a remote/Unsplash image)
  // 3. If not found, use default for category
  let imagen_url = findLocalImage(p.nombre);
  if (!imagen_url) {
    if (old.imagen_url && (old.imagen_url.startsWith('http://') || old.imagen_url.startsWith('https://'))) {
      imagen_url = old.imagen_url;
    } else {
      imagen_url = categoryDefaults[p.categoria] || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop';
    }
  }

  // Clean empty or default fields
  if (p.maridaje_sugerido === "Bebida sugerida" || p.maridaje_sugerido === "Acompañamiento sugerido" || p.maridaje_sugerido.toLowerCase() === "ninguno") {
    p.maridaje_sugerido = "";
  }

  return {
    id,
    nombre: p.nombre,
    slogan_corto: p.slogan_corto,
    imagen_url,
    categoria: p.categoria,
    etiquetas: p.etiquetas,
    descripcion_emocional: p.descripcion_emocional,
    ingredientes_clave: p.ingredientes_clave,
    informacion_nutricional,
    alergenos: p.alergenos,
    maridaje_sugerido: p.maridaje_sugerido,
    opciones: p.opciones || [],
    recomendado: p.recomendado
  };
});

fs.writeFileSync(jsonPath, JSON.stringify(finalProducts, null, 2), 'utf8');
console.log(`Successfully compiled ${finalProducts.length} products to ${jsonPath}`);
