const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'database.json');
const outPath = path.join(__dirname, '..', 'supabase', 'seed_products.sql');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Validated category mapping from live Supabase public.categories
const categoryMap = {
  'cat-grafted': 'c0000001-0000-0000-0000-000000000001',
  'cat-arabicum': 'c0000001-0000-0000-0000-000000000002',
  'cat-rare': 'c0000001-0000-0000-0000-000000000003',
  'cat-obesum': 'c0000001-0000-0000-0000-000000000004',
  'cat-bonsai': 'c0000001-0000-0000-0000-000000000005',
  'cat-care': 'c0000001-0000-0000-0000-000000000006'
};

// Stable deterministic UUIDs for products (100% valid hexadecimal UUIDs)
const productUuidMap = {
  'prod-dorset-horn': 'a0000001-0000-0000-0000-000000000001',
  'prod-triple-black-king': 'a0000001-0000-0000-0000-000000000002',
  'prod-super-baobab-arabicum': 'a0000001-0000-0000-0000-000000000003',
  'prod-white-diamond-triple': 'a0000001-0000-0000-0000-000000000004',
  'prod-star-of-pakistan': 'a0000001-0000-0000-0000-000000000005',
  'prod-golden-crown-socotranum': 'a0000001-0000-0000-0000-000000000006',
  'prod-desert-sunset-yellow': 'a0000001-0000-0000-0000-000000000007',
  'prod-fresh-hybrid-seeds-20': 'a0000001-0000-0000-0000-000000000008',
  'prod-bonsai-potting-substrate-5kg': 'a0000001-0000-0000-0000-000000000009'
};

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

let sql = `-- ==================================================================\n`;
sql += `-- SEED PRODUCTS & PRODUCT IMAGES FOR PAK ADENIUM NURSERY\n`;
sql += `-- Generated from data/database.json\n`;
sql += `-- Total Products: ${db.products.length}\n`;
sql += `-- ==================================================================\n\n`;

let productInsertCount = 0;
let imageInsertCount = 0;

db.products.forEach((p, pIndex) => {
  const pUuid = productUuidMap[p.id];
  if (!pUuid || !uuidRegex.test(pUuid)) {
    throw new Error(`Invalid or missing UUID for product: ${p.id}`);
  }

  const catUuid = categoryMap[p.category_id];
  if (!catUuid || !uuidRegex.test(catUuid)) {
    throw new Error(`Invalid or missing category UUID for product ${p.id} (category_id: ${p.category_id})`);
  }

  const lowStock = p.low_stock_threshold !== undefined && p.low_stock_threshold !== null ? p.low_stock_threshold : 3;
  const isGrafted = p.is_grafted !== undefined && p.is_grafted !== null ? p.is_grafted : false;
  const isFeatured = p.is_featured !== undefined && p.is_featured !== null ? p.is_featured : false;
  const isPublished = p.is_published !== undefined && p.is_published !== null ? p.is_published : true;
  const createdAt = p.created_at || '2026-10-20T00:00:00.000Z';
  const updatedAt = p.updated_at || createdAt;

  sql += `-- Product [${pIndex + 1}/${db.products.length}]: ${p.name} (${p.sku})\n`;
  sql += `INSERT INTO public.products (\n`;
  sql += `  id, name, slug, sku, category_id, species, variety, flower_color, petal_type,\n`;
  sql += `  price, sale_price, stock_quantity, low_stock_threshold, caudex_size, plant_age,\n`;
  sql += `  is_grafted, pot_size, description, care_watering, care_sunlight, care_temperature,\n`;
  sql += `  care_soil, seasonal_notes, is_featured, is_published, seo_title, seo_description,\n`;
  sql += `  created_at, updated_at\n`;
  sql += `) VALUES (\n`;
  sql += `  ${esc(pUuid)},\n`;
  sql += `  ${esc(p.name)},\n`;
  sql += `  ${esc(p.slug)},\n`;
  sql += `  ${esc(p.sku)},\n`;
  sql += `  ${esc(catUuid)},\n`;
  sql += `  ${esc(p.species)},\n`;
  sql += `  ${esc(p.variety)},\n`;
  sql += `  ${esc(p.flower_color)},\n`;
  sql += `  ${esc(p.petal_type)},\n`;
  sql += `  ${esc(p.price)},\n`;
  sql += `  ${esc(p.sale_price)},\n`;
  sql += `  ${esc(p.stock_quantity)},\n`;
  sql += `  ${esc(lowStock)},\n`;
  sql += `  ${esc(p.caudex_size)},\n`;
  sql += `  ${esc(p.plant_age)},\n`;
  sql += `  ${esc(isGrafted)},\n`;
  sql += `  ${esc(p.pot_size)},\n`;
  sql += `  ${esc(p.description)},\n`;
  sql += `  ${esc(p.care_watering)},\n`;
  sql += `  ${esc(p.care_sunlight)},\n`;
  sql += `  ${esc(p.care_temperature)},\n`;
  sql += `  ${esc(p.care_soil)},\n`;
  sql += `  ${esc(p.seasonal_notes)},\n`;
  sql += `  ${esc(isFeatured)},\n`;
  sql += `  ${esc(isPublished)},\n`;
  sql += `  ${esc(p.seo_title)},\n`;
  sql += `  ${esc(p.seo_description)},\n`;
  sql += `  ${esc(createdAt)},\n`;
  sql += `  ${esc(updatedAt)}\n`;
  sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;

  productInsertCount++;

  if (Array.isArray(p.images) && p.images.length > 0) {
    p.images.forEach((img, imgIndex) => {
      // Deterministic image UUID: b0000001-0000-0000-0000-0000000000XX
      const imgSeq = (pIndex * 2 + imgIndex + 1).toString().padStart(12, '0');
      const imgUuid = `b0000001-0000-0000-0000-${imgSeq}`;
      if (!uuidRegex.test(imgUuid)) {
        throw new Error(`Generated invalid UUID for image: ${imgUuid}`);
      }

      const isPrimary = img.is_primary !== undefined && img.is_primary !== null ? img.is_primary : (imgIndex === 0);
      const displayOrder = img.display_order !== undefined && img.display_order !== null ? img.display_order : (imgIndex + 1);

      sql += `INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (\n`;
      sql += `  ${esc(imgUuid)},\n`;
      sql += `  ${esc(pUuid)},\n`;
      sql += `  ${esc(img.image_url)},\n`;
      sql += `  ${esc(img.alt_text)},\n`;
      sql += `  ${esc(isPrimary)},\n`;
      sql += `  ${esc(displayOrder)}\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n`;

      imageInsertCount++;
    });
    sql += `\n`;
  }
});

fs.writeFileSync(outPath, sql, 'utf8');

console.log('--- GENERATION SUMMARY ---');
console.log(`Original products in JSON: ${db.products.length}`);
console.log(`Generated product inserts: ${productInsertCount}`);
console.log(`Generated image inserts:   ${imageInsertCount}`);
console.log(`Output file:               ${outPath}`);
console.log(`File size (bytes):         ${fs.statSync(outPath).size}`);

