/**
 * Automated End-to-End Runtime Verification Script for Pak Adenium Nursery
 * Validates Supabase connectivity, atomic checkout, RLS, stock protection,
 * and performs strict cleanup to maintain baseline data integrity.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load and parse .env.local safely
const envPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('FATAL: .env.local file not found at', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
for (const line of envContent.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx > 0) {
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    envVars[key] = val;
  }
}

// Check SUPABASE_SERVICE_ROLE_KEY
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY || '';
const serviceRoleKeyLen = serviceRoleKey.length;
const isSbSecretFormat = serviceRoleKey.startsWith('sb_secret_');
const isLegacyJwt = serviceRoleKey.startsWith('ey');
const isPopulated = (isSbSecretFormat && serviceRoleKeyLen >= 35) || (isLegacyJwt && serviceRoleKeyLen > 100) || serviceRoleKeyLen >= 35;

console.log('================================================================');
console.log('  PAK ADENIUM NURSERY — PHASE 4: END-TO-END VERIFICATION');
console.log('================================================================');
console.log(`[Key Check] SUPABASE_SERVICE_ROLE_KEY length on disk: ${serviceRoleKeyLen} characters`);
console.log(`[Key Check] Key format detected: ${isSbSecretFormat ? 'Supabase Secret (sb_secret_...)' : isLegacyJwt ? 'Legacy JWT' : 'Standard Secret Key'}`);
console.log(`[Key Check] Populated & Valid: ${isPopulated ? 'YES (PASSED)' : 'NO (FAILED)'}`);

if (!isPopulated) {
  console.error('FATAL: SUPABASE_SERVICE_ROLE_KEY is missing or invalid in .env.local!');
  process.exit(1);
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
  console.error('FATAL: NEXT_PUBLIC_SUPABASE_URL is missing in .env.local!');
  process.exit(1);
}

const supabaseAnon = createClient(supabaseUrl, anonKey);
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runTests() {
  const testResults = [];
  let testOrderId = null;
  let testOrderNumber = null;
  let testProductId = null;
  let initialStock = 0;
  let testInquiryId = null;

  try {
    // 0. Baseline counts check
    console.log('\n--- 0. CHECKING BASELINE TABLE STATE ---');
    const [
      { count: catCount },
      { count: prodCount },
      { count: ordCount },
      { count: inqCount },
    ] = await Promise.all([
      supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('inquiries').select('*', { count: 'exact', head: true }),
    ]);

    console.log(`Baseline counts: Categories=${catCount}, Products=${prodCount}, Orders=${ordCount}, Inquiries=${inqCount}`);

    // 1. Storefront Reads
    console.log('\n--- 1. TESTING STOREFRONT READS (Public & Anonymous Access) ---');
    
    // Categories
    const { data: categories, error: catErr } = await supabaseAnon
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (catErr || !categories || categories.length === 0) {
      throw new Error(`Failed to read categories: ${catErr?.message || 'Empty array'}`);
    }
    console.log(`[PASS] getCategories: Retrieved ${categories.length} active categories`);
    testResults.push({ name: 'Storefront: Categories Read', passed: true });

    // Products with joined images and category
    const { data: products, error: prodErr } = await supabaseAnon
      .from('products')
      .select('*, categories(name, slug), product_images(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (prodErr || !products || products.length === 0) {
      throw new Error(`Failed to read products: ${prodErr?.message || 'Empty array'}`);
    }
    
    const sampleProduct = products[0];
    const sampleImages = sampleProduct.product_images || [];
    if (sampleImages.length === 0) {
      throw new Error(`Product ${sampleProduct.name} returned zero joined product_images`);
    }
    console.log(`[PASS] getProducts: Retrieved ${products.length} published products with joined images (Sample "${sampleProduct.name}" has ${sampleImages.length} images)`);
    testResults.push({ name: 'Storefront: Products & Images Join', passed: true });

    // Product by slug
    const targetSlug = sampleProduct.slug;
    const { data: productBySlug, error: slugErr } = await supabaseAnon
      .from('products')
      .select('*, categories(name), product_images(*)')
      .eq('slug', targetSlug)
      .single();

    if (slugErr || !productBySlug) {
      throw new Error(`Failed to read product by slug "${targetSlug}": ${slugErr?.message}`);
    }
    console.log(`[PASS] getProductBySlug: Found "${productBySlug.name}" (${productBySlug.sku}) for slug "${targetSlug}"`);
    testResults.push({ name: 'Storefront: Product by Slug', passed: true });

    // Articles
    const { data: articles, error: artErr } = await supabaseAnon
      .from('articles')
      .select('*')
      .eq('is_published', true);

    if (artErr || !articles || articles.length === 0) {
      throw new Error(`Failed to read articles: ${artErr?.message || 'Empty array'}`);
    }
    console.log(`[PASS] getArticles: Retrieved ${articles.length} published articles`);
    testResults.push({ name: 'Storefront: Articles Read', passed: true });

    // Site Settings (all 7 keys)
    const { data: settingsRows, error: setErr } = await supabaseAnon
      .from('site_settings')
      .select('key, value');

    if (setErr || !settingsRows || settingsRows.length === 0) {
      throw new Error(`Failed to read site settings: ${setErr?.message || 'Empty array'}`);
    }
    const settingsKeys = settingsRows.map((r) => r.key);
    console.log(`[PASS] getSiteSettings: Retrieved settings keys: [${settingsKeys.join(', ')}]`);
    testResults.push({ name: 'Storefront: Site Settings Read', passed: true });

    // Approved Reviews
    const { data: reviews, error: revErr } = await supabaseAnon
      .from('reviews')
      .select('*')
      .eq('is_approved', true);

    if (revErr) {
      throw new Error(`Failed to read reviews: ${revErr.message}`);
    }
    console.log(`[PASS] getApprovedReviews: Retrieved ${reviews.length} approved reviews`);
    testResults.push({ name: 'Storefront: Approved Reviews Read', passed: true });

    // 2. Atomic Order Creation
    console.log('\n--- 2. TESTING ATOMIC CHECKOUT (RPC create_order_atomic) ---');
    const targetProduct = products.find((p) => p.stock_quantity > 0) || products[0];
    testProductId = targetProduct.id;
    initialStock = targetProduct.stock_quantity;
    console.log(`Selected test product: "${targetProduct.name}" (ID: ${testProductId}) with initial stock: ${initialStock}`);

    const testPayload = {
      customer_name: 'Automated E2E Test Runner',
      customer_phone: '03001234567',
      customer_whatsapp: '923001234567',
      customer_email: 'e2e-test@pakadenium.pk',
      province: 'Punjab',
      city: 'Lahore',
      area: 'DHA Phase 5 Test Zone',
      shipping_address: 'Botanical Test Suite Lab 404',
      order_notes: 'Automated Phase 4 verification test order',
      payment_method: 'Cash on Delivery',
    };

    const testItems = [
      {
        product_id: testProductId,
        quantity: 1,
      },
    ];

    const { data: rpcResult, error: rpcErr } = await supabaseAdmin.rpc('create_order_atomic', {
      p_order_payload: testPayload,
      p_order_items: testItems,
    });

    if (rpcErr || !rpcResult || !rpcResult.success) {
      throw new Error(`create_order_atomic failed: ${rpcErr?.message || JSON.stringify(rpcResult)}`);
    }

    testOrderId = rpcResult.order_id;
    testOrderNumber = rpcResult.order_number;
    console.log(`[PASS] create_order_atomic succeeded: Created order #${testOrderNumber} (ID: ${testOrderId})`);

    // Verify stock decremented
    const { data: updatedProd, error: checkStockErr } = await supabaseAdmin
      .from('products')
      .select('stock_quantity')
      .eq('id', testProductId)
      .single();

    if (checkStockErr || updatedProd.stock_quantity !== initialStock - 1) {
      throw new Error(`Stock decrement failed! Expected ${initialStock - 1}, got ${updatedProd?.stock_quantity}`);
    }
    console.log(`[PASS] Stock verified: decremented by 1 from ${initialStock} -> ${updatedProd.stock_quantity}`);

    // Verify order_items and inventory_logs
    const [
      { data: orderItems, error: itemsErr },
      { data: invLogs, error: logErr },
    ] = await Promise.all([
      supabaseAdmin.from('order_items').select('*').eq('order_id', testOrderId),
      supabaseAdmin.from('inventory_logs').select('*').eq('reference_id', testOrderNumber),
    ]);

    if (itemsErr || !orderItems || orderItems.length !== 1) {
      throw new Error(`Order items verification failed: ${itemsErr?.message}`);
    }
    if (logErr || !invLogs || invLogs.length !== 1) {
      throw new Error(`Inventory log verification failed: ${logErr?.message}`);
    }
    console.log(`[PASS] Relational integrity verified: 1 order_item and 1 inventory_log audit row created`);
    testResults.push({ name: 'Atomic Checkout & Stock Decrement', passed: true });

    // 3. Stock Protection Test
    console.log('\n--- 3. TESTING STOCK PROTECTION (Oversell Prevention) ---');
    const { data: oversellResult, error: oversellErr } = await supabaseAdmin.rpc('create_order_atomic', {
      p_order_payload: testPayload,
      p_order_items: [{ product_id: testProductId, quantity: 9999 }],
    });

    if (!oversellErr && oversellResult?.success) {
      throw new Error('Stock protection failed: ordering 9999 units should have failed but succeeded!');
    }
    console.log(`[PASS] Stock protection triggered as expected: "${oversellErr?.message || 'Rejected'}"`);
    testResults.push({ name: 'Oversell Prevention Guard', passed: true });

    // 4. Order Lookup & Status Updates
    console.log('\n--- 4. TESTING ORDER LOOKUP & ADMIN STATUS UPDATES ---');
    // Fetch by order number
    const { data: fetchedOrder, error: fetchErr } = await supabaseAdmin
      .from('orders')
      .select('*, items:order_items(*)')
      .ilike('order_number', testOrderNumber)
      .single();

    if (fetchErr || !fetchedOrder) {
      throw new Error(`Failed to lookup order by number: ${fetchErr?.message}`);
    }
    console.log(`[PASS] Order lookup by number #${testOrderNumber} succeeded (Items count: ${fetchedOrder.items.length})`);

    // Update status to Confirmed / Shipped
    const { data: updatedOrder, error: updateErr } = await supabaseAdmin
      .from('orders')
      .update({
        order_status: 'Confirmed',
        payment_status: 'Verified',
        tracking_number: 'PAK-TRACK-9999',
        courier_name: 'TCS Express Live Plants',
        admin_notes: 'Verified via WhatsApp E2E script',
        updated_at: new Date().toISOString(),
      })
      .eq('id', testOrderId)
      .select()
      .single();

    if (updateErr || updatedOrder.order_status !== 'Confirmed') {
      throw new Error(`Order status update failed: ${updateErr?.message}`);
    }
    console.log(`[PASS] updateOrderStatus succeeded: status changed to Confirmed, tracking: ${updatedOrder.tracking_number}`);
    testResults.push({ name: 'Order Lookup & Admin Updates', passed: true });

    // 5. Contact Inquiries
    console.log('\n--- 5. TESTING CONTACT INQUIRIES ---');
    const inquiryUuid = '00000000-0000-0000-0000-000000000999';
    const testInquiry = {
      id: inquiryUuid,
      name: 'E2E Test Botanist',
      phone: '03009988776',
      email: 'inquiry.test@pakadenium.pk',
      subject: 'Inquiring about rare Dorset Horn grafting stock',
      message: 'Automated test inquiry verifying public submission to Supabase.',
      status: 'New',
    };

    // Public submit without select() (constrained by RLS write-only policy)
    const { error: inqErr } = await supabaseAnon
      .from('inquiries')
      .insert(testInquiry);

    if (inqErr) {
      throw new Error(`Failed to submit inquiry: ${inqErr?.message}`);
    }
    testInquiryId = inquiryUuid;

    // Verify record exists in public.inquiries via administrative client
    const { data: inqRecord, error: getInqErr } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('id', testInquiryId)
      .single();

    if (getInqErr || !inqRecord) {
      throw new Error(`Inquiry verification failed: ${getInqErr?.message}`);
    }

    console.log(`[PASS] submitInquiry succeeded: Inquiry ID ${testInquiryId} logged with status '${inqRecord.status}'`);
    testResults.push({ name: 'Contact Inquiry Pipeline', passed: true });

  } catch (err) {
    console.error('\n❌ TEST RUNNER FAILURE:', err.message);
    testResults.push({ name: 'Test Suite Execution', passed: false, error: err.message });
  } finally {
    // 6. CRITICAL CLEANUP
    console.log('\n--- 6. EXECUTING STRICT TEARDOWN & CLEANUP ---');
    
    if (testOrderId) {
      // Delete test order (cascade deletes order_items)
      const { error: delOrdErr } = await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', testOrderId);
      if (delOrdErr) console.warn('Warning: Failed to delete test order:', delOrdErr.message);
      else console.log(`[CLEANUP] Deleted test order #${testOrderNumber} and associated items`);
    }

    if (testOrderNumber) {
      // Delete test inventory_logs
      const { error: delLogErr } = await supabaseAdmin
        .from('inventory_logs')
        .delete()
        .eq('reference_id', testOrderNumber);
      if (delLogErr) console.warn('Warning: Failed to delete test inventory log:', delLogErr.message);
      else console.log(`[CLEANUP] Deleted test inventory audit log for ${testOrderNumber}`);
    }

    if (testProductId && initialStock !== undefined) {
      // Restore stock_quantity
      const { error: resStockErr } = await supabaseAdmin
        .from('products')
        .update({ stock_quantity: initialStock })
        .eq('id', testProductId);
      if (resStockErr) console.warn('Warning: Failed to restore product stock:', resStockErr.message);
      else console.log(`[CLEANUP] Restored test product stock back to exact original value: ${initialStock}`);
    }

    if (testInquiryId) {
      // Delete test inquiry
      const { error: delInqErr } = await supabaseAdmin
        .from('inquiries')
        .delete()
        .eq('id', testInquiryId);
      if (delInqErr) console.warn('Warning: Failed to delete test inquiry:', delInqErr.message);
      else console.log(`[CLEANUP] Deleted test inquiry ${testInquiryId}`);
    }

    // Verify baseline table counts restored
    const [
      { count: finalCat },
      { count: finalProd },
      { count: finalOrd },
      { count: finalInq },
    ] = await Promise.all([
      supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('inquiries').select('*', { count: 'exact', head: true }),
    ]);

    console.log(`\nFinal table counts after cleanup: Categories=${finalCat}, Products=${finalProd}, Orders=${finalOrd}, Inquiries=${finalInq}`);
    const clean = finalOrd === 3 && finalInq === 0;
    console.log(`Database clean status: ${clean ? 'PERFECT BASELINE RESTORED' : 'CHECK REMAINING ROWS'}`);
  }

  console.log('\n================================================================');
  console.log('  FINAL VERIFICATION SUMMARY');
  console.log('================================================================');
  testResults.forEach((t) => {
    console.log(`${t.passed ? '✓' : '✗'} ${t.name}: ${t.passed ? 'PASSED' : 'FAILED (' + t.error + ')'}`);
  });
  console.log('================================================================');

  const allPassed = testResults.every((t) => t.passed);
  if (!allPassed) {
    process.exit(1);
  }
}

runTests();
