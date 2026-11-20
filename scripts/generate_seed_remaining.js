const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'database.json');
const outPath = path.join(__dirname, '..', 'supabase', 'seed_remaining.sql');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// Strict 1-to-1 Product UUID mapping established in seed_products.sql
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

// Deterministic UUID maps for remaining tables
const articleUuidMap = {
  'art-caudex-fattening': 'e0000001-0000-0000-0000-000000000001',
  'art-monsoon-rot-prevention': 'e0000001-0000-0000-0000-000000000002',
  'art-winter-dormancy-pakistan': 'e0000001-0000-0000-0000-000000000003'
};

const orderUuidMap = {
  'ord-0581ggvb': 'd0000001-0000-0000-0000-000000000001',
  'ord-84818dld': 'd0000001-0000-0000-0000-000000000002',
  'ord-demo-001': 'd0000001-0000-0000-0000-000000000003'
};

const orderItemUuidMap = {
  'item-yq57m00': 'd0000002-0000-0000-0000-000000000001',
  'item-60dwa21': 'd0000002-0000-0000-0000-000000000002',
  'item-9dy5wvx': 'd0000002-0000-0000-0000-000000000003',
  'item-frdpcis': 'd0000002-0000-0000-0000-000000000004',
  'item-1': 'd0000002-0000-0000-0000-000000000005'
};

const reviewUuidMap = {
  'rev-1': 'f0000001-0000-0000-0000-000000000001',
  'rev-2': 'f0000001-0000-0000-0000-000000000002',
  'rev-3': 'f0000001-0000-0000-0000-000000000003'
};

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  return "'" + String(val).replace(/'/g, "''") + "'";
}

let sql = `-- ==================================================================\n`;
sql += `-- SEED REMAINING DATA FOR PAK ADENIUM NURSERY\n`;
sql += `-- Generated from data/database.json\n`;
sql += `-- Includes: Articles (3), Orders (3), Order Items (5), Reviews (3)\n`;
sql += `-- ==================================================================\n\n`;

// 1. ARTICLES
sql += `-- ==================================================================\n`;
sql += `-- 1. ARTICLES TABLE (${db.articles ? db.articles.length : 0} records)\n`;
sql += `-- ==================================================================\n\n`;

let articleCount = 0;
(db.articles || []).forEach((art, idx) => {
  const artUuid = articleUuidMap[art.id] || `e0000001-0000-0000-0000-${(idx + 1).toString().padStart(12, '0')}`;
  if (!uuidRegex.test(artUuid)) {
    throw new Error(`Invalid UUID for article: ${art.id}`);
  }

  sql += `-- Article [${idx + 1}/${db.articles.length}]: ${art.title}\n`;
  sql += `INSERT INTO public.articles (\n`;
  sql += `  id, title, slug, category, excerpt, content, featured_image,\n`;
  sql += `  author_name, read_time_minutes, is_published, seo_title, seo_description,\n`;
  sql += `  created_at, updated_at\n`;
  sql += `) VALUES (\n`;
  sql += `  ${esc(artUuid)},\n`;
  sql += `  ${esc(art.title)},\n`;
  sql += `  ${esc(art.slug)},\n`;
  sql += `  ${esc(art.category)},\n`;
  sql += `  ${esc(art.excerpt)},\n`;
  sql += `  ${esc(art.content)},\n`;
  sql += `  ${esc(art.featured_image)},\n`;
  sql += `  ${esc(art.author_name || 'Pak Adenium Master Horticulturist')},\n`;
  sql += `  ${esc(art.read_time_minutes || 5)},\n`;
  sql += `  ${esc(art.is_published ?? true)},\n`;
  sql += `  ${esc(art.seo_title)},\n`;
  sql += `  ${esc(art.seo_description)},\n`;
  sql += `  ${esc(art.created_at || '2026-10-20T00:00:00.000Z')},\n`;
  sql += `  ${esc(art.updated_at || art.created_at || '2026-10-20T00:00:00.000Z')}\n`;
  sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
  articleCount++;
});

// 2. CONTENT SECTIONS
const contentSections = db.content_sections || db.contentSections || [];
sql += `-- ==================================================================\n`;
sql += `-- 2. CONTENT SECTIONS TABLE (${contentSections.length} records)\n`;
sql += `-- ==================================================================\n\n`;

let sectionCount = 0;
if (contentSections.length === 0) {
  sql += `-- (No content_sections defined in data/database.json)\n\n`;
} else {
  contentSections.forEach((sec, idx) => {
    const secUuid = `70000001-0000-0000-0000-${(idx + 1).toString().padStart(12, '0')}`;
    sql += `INSERT INTO public.content_sections (\n`;
    sql += `  id, section_key, title, subtitle, body, media_url, cta_text, cta_link, is_active, extra_data, updated_at\n`;
    sql += `) VALUES (\n`;
    sql += `  ${esc(secUuid)},\n`;
    sql += `  ${esc(sec.section_key)},\n`;
    sql += `  ${esc(sec.title)},\n`;
    sql += `  ${esc(sec.subtitle)},\n`;
    sql += `  ${esc(sec.body)},\n`;
    sql += `  ${esc(sec.media_url)},\n`;
    sql += `  ${esc(sec.cta_text)},\n`;
    sql += `  ${esc(sec.cta_link)},\n`;
    sql += `  ${esc(sec.is_active ?? true)},\n`;
    sql += `  ${sec.extra_data ? "'" + JSON.stringify(sec.extra_data).replace(/'/g, "''") + "'::jsonb" : 'NULL'},\n`;
    sql += `  ${esc(sec.updated_at || '2026-10-20T00:00:00.000Z')}\n`;
    sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
    sectionCount++;
  });
}

// 3. ORDERS
sql += `-- ==================================================================\n`;
sql += `-- 3. ORDERS TABLE (${db.orders ? db.orders.length : 0} records)\n`;
sql += `-- ==================================================================\n\n`;

let orderCount = 0;
let orderItemCount = 0;

(db.orders || []).forEach((ord, oIdx) => {
  const ordUuid = orderUuidMap[ord.id] || `d0000001-0000-0000-0000-${(oIdx + 1).toString().padStart(12, '0')}`;
  if (!uuidRegex.test(ordUuid)) {
    throw new Error(`Invalid UUID for order: ${ord.id}`);
  }

  sql += `-- Order [${oIdx + 1}/${db.orders.length}]: ${ord.order_number} (${ord.customer_name})\n`;
  sql += `INSERT INTO public.orders (\n`;
  sql += `  id, order_number, customer_name, customer_phone, customer_whatsapp, customer_email,\n`;
  sql += `  province, city, area, shipping_address, order_notes, admin_notes,\n`;
  sql += `  subtotal, shipping_fee, discount, total, payment_method, payment_status, order_status,\n`;
  sql += `  tracking_number, courier_name, created_at, updated_at\n`;
  sql += `) VALUES (\n`;
  sql += `  ${esc(ordUuid)},\n`;
  sql += `  ${esc(ord.order_number)},\n`;
  sql += `  ${esc(ord.customer_name)},\n`;
  sql += `  ${esc(ord.customer_phone)},\n`;
  sql += `  ${esc(ord.customer_whatsapp)},\n`;
  sql += `  ${esc(ord.customer_email)},\n`;
  sql += `  ${esc(ord.province)},\n`;
  sql += `  ${esc(ord.city)},\n`;
  sql += `  ${esc(ord.area)},\n`;
  sql += `  ${esc(ord.shipping_address)},\n`;
  sql += `  ${esc(ord.order_notes)},\n`;
  sql += `  ${esc(ord.admin_notes)},\n`;
  sql += `  ${esc(ord.subtotal)},\n`;
  sql += `  ${esc(ord.shipping_fee || 0)},\n`;
  sql += `  ${esc(ord.discount || 0)},\n`;
  sql += `  ${esc(ord.total)},\n`;
  sql += `  ${esc(ord.payment_method)},\n`;
  sql += `  ${esc(ord.payment_status || 'Pending')},\n`;
  sql += `  ${esc(ord.order_status || 'Pending')},\n`;
  sql += `  ${esc(ord.tracking_number || null)},\n`;
  sql += `  ${esc(ord.courier_name || null)},\n`;
  sql += `  ${esc(ord.created_at || '2026-10-20T00:00:00.000Z')},\n`;
  sql += `  ${esc(ord.updated_at || ord.created_at || '2026-10-20T00:00:00.000Z')}\n`;
  sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
  orderCount++;

  // 4. ORDER ITEMS
  if (Array.isArray(ord.items) && ord.items.length > 0) {
    ord.items.forEach((item, iIdx) => {
      const itemUuid = orderItemUuidMap[item.id] || `d0000002-0000-0000-0000-${(orderItemCount + 1).toString().padStart(12, '0')}`;
      if (!uuidRegex.test(itemUuid)) {
        throw new Error(`Invalid UUID for order item: ${item.id}`);
      }

      const productUuid = productUuidMap[item.product_id];
      if (!productUuid || !uuidRegex.test(productUuid)) {
        throw new Error(`Foreign Key Error: Cannot map order item product_id '${item.product_id}' to a known product UUID!`);
      }

      sql += `INSERT INTO public.order_items (\n`;
      sql += `  id, order_id, product_id, product_name, product_sku, unit_price, quantity, total_price, image_url, created_at\n`;
      sql += `) VALUES (\n`;
      sql += `  ${esc(itemUuid)},\n`;
      sql += `  ${esc(ordUuid)},\n`;
      sql += `  ${esc(productUuid)},\n`;
      sql += `  ${esc(item.product_name)},\n`;
      sql += `  ${esc(item.product_sku)},\n`;
      sql += `  ${esc(item.unit_price)},\n`;
      sql += `  ${esc(item.quantity)},\n`;
      sql += `  ${esc(item.total_price)},\n`;
      sql += `  ${esc(item.image_url)},\n`;
      sql += `  ${esc(ord.created_at || '2026-10-20T00:00:00.000Z')}\n`;
      sql += `) ON CONFLICT (id) DO NOTHING;\n`;
      orderItemCount++;
    });
    sql += `\n`;
  }
});

// 5. REVIEWS
sql += `-- ==================================================================\n`;
sql += `-- 5. REVIEWS TABLE (${db.reviews ? db.reviews.length : 0} records)\n`;
sql += `-- ==================================================================\n\n`;

let reviewCount = 0;
(db.reviews || []).forEach((rev, rIdx) => {
  const revUuid = reviewUuidMap[rev.id] || `f0000001-0000-0000-0000-${(rIdx + 1).toString().padStart(12, '0')}`;
  if (!uuidRegex.test(revUuid)) {
    throw new Error(`Invalid UUID for review: ${rev.id}`);
  }

  const productUuid = productUuidMap[rev.product_id];
  if (!productUuid || !uuidRegex.test(productUuid)) {
    throw new Error(`Foreign Key Error: Cannot map review product_id '${rev.product_id}' to a known product UUID!`);
  }

  sql += `-- Review [${rIdx + 1}/${db.reviews.length}] for product ${rev.product_id}\n`;
  sql += `INSERT INTO public.reviews (\n`;
  sql += `  id, product_id, customer_name, rating, comment, verified_purchase, is_approved, created_at\n`;
  sql += `) VALUES (\n`;
  sql += `  ${esc(revUuid)},\n`;
  sql += `  ${esc(productUuid)},\n`;
  sql += `  ${esc(rev.customer_name)},\n`;
  sql += `  ${esc(rev.rating)},\n`;
  sql += `  ${esc(rev.comment)},\n`;
  sql += `  ${esc(rev.verified_purchase ?? false)},\n`;
  sql += `  ${esc(rev.is_approved ?? false)},\n`;
  sql += `  ${esc(rev.created_at || '2026-10-20T00:00:00.000Z')}\n`;
  sql += `) ON CONFLICT (id) DO NOTHING;\n\n`;
  reviewCount++;
});

fs.writeFileSync(outPath, sql, 'utf8');

console.log('--- GENERATION SUMMARY FOR seed_remaining.sql ---');
console.log(`Articles generated:     ${articleCount}`);
console.log(`Content sections:       ${sectionCount}`);
console.log(`Orders generated:       ${orderCount}`);
console.log(`Order items generated:  ${orderItemCount}`);
console.log(`Reviews generated:      ${reviewCount}`);
console.log(`Output file:            ${outPath}`);
console.log(`File size (bytes):      ${fs.statSync(outPath).size}`);

