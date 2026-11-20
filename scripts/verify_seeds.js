const fs = require('fs');

const seedProd = fs.readFileSync('supabase/seed_products.sql', 'utf8');
const seedRem = fs.readFileSync('supabase/seed_remaining.sql', 'utf8');
const storagePol = fs.readFileSync('supabase/storage_policies.sql', 'utf8');

console.log('--- COMPREHENSIVE VALIDATION CHECK ---');

// Extract product UUIDs from seed_products.sql
const prodMatches = [...seedProd.matchAll(/INSERT INTO public\.products[\s\S]*?VALUES \(\s*'([0-9a-f-]+)'/g)].map(m => m[1]);
console.log('Product UUIDs found in seed_products.sql:', prodMatches.length);

// Extract order UUIDs
const orderMatches = [...seedRem.matchAll(/INSERT INTO public\.orders[\s\S]*?VALUES \(\s*'([0-9a-f-]+)'/g)].map(m => m[1]);
console.log('Order UUIDs found in seed_remaining.sql:', orderMatches.length);

// Extract order_items: id, order_id, product_id
const orderItemMatches = [...seedRem.matchAll(/INSERT INTO public\.order_items[\s\S]*?VALUES \(\s*'([0-9a-f-]+)',\s*'([0-9a-f-]+)',\s*'([0-9a-f-]+)'/g)];
console.log('Order item inserts found:', orderItemMatches.length);

let orderItemFkValid = true;
orderItemMatches.forEach((m, idx) => {
  const [_, itemId, ordId, prodId] = m;
  const ordValid = orderMatches.includes(ordId);
  const prodValid = prodMatches.includes(prodId);
  if (!ordValid || !prodValid) {
    console.error(`OrderItem #${idx + 1} FK Error: order valid=${ordValid}, prod valid=${prodValid}`);
    orderItemFkValid = false;
  }
});
console.log('All OrderItem Foreign Keys strictly valid against Orders & Products:', orderItemFkValid);

// Extract reviews: id, product_id
const reviewMatches = [...seedRem.matchAll(/INSERT INTO public\.reviews[\s\S]*?VALUES \(\s*'([0-9a-f-]+)',\s*'([0-9a-f-]+)'/g)];
console.log('Review inserts found:', reviewMatches.length);

let reviewFkValid = true;
reviewMatches.forEach((m, idx) => {
  const [_, revId, prodId] = m;
  const prodValid = prodMatches.includes(prodId);
  if (!prodValid) {
    console.error(`Review #${idx + 1} FK Error: prod valid=${prodValid}`);
    reviewFkValid = false;
  }
});
console.log('All Review Foreign Keys strictly valid against Products:', reviewFkValid);

// Extract articles
const artMatches = [...seedRem.matchAll(/INSERT INTO public\.articles[\s\S]*?VALUES \(\s*'([0-9a-f-]+)'/g)].map(m => m[1]);
console.log('Article UUIDs found:', artMatches.length);

// Check storage policies
console.log('Storage policies contains product-media scoped policies:', storagePol.includes("bucket_id = 'product-media'"));

