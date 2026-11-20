-- ==================================================================
-- SEED REMAINING DATA FOR PAK ADENIUM NURSERY
-- Generated from data/database.json
-- Includes: Articles (3), Orders (3), Order Items (5), Reviews (3)
-- ==================================================================

-- ==================================================================
-- 1. ARTICLES TABLE (3 records)
-- ==================================================================

-- Article [1/3]: The Art of Caudex Fattening: Cultivating Sculptural Bases in Pakistani Climates
INSERT INTO public.articles (
  id, title, slug, category, excerpt, content, featured_image,
  author_name, read_time_minutes, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'e0000001-0000-0000-0000-000000000001',
  'The Art of Caudex Fattening: Cultivating Sculptural Bases in Pakistani Climates',
  'art-of-caudex-fattening-pakistan-climate',
  'Bonsai & Training',
  'Why deep watering cycles, shallow training dishes, and root raising create dramatic elephantine bases in 3-5 years.',
  '
## Why Caudex Architecture Defines the Desert Rose

In the world of Adenium cultivation, the flower provides fleeting beauty, but the **caudex** is eternal. A well-sculpted, swollen caudex transforms a simple flowering shrub into a museum-grade living bonsai sculpture.

For growers across Punjab, Sindh, and Khyber Pakhtunkhwa, our extended hot summers present a tremendous biological advantage. Here are our nursery''s proven techniques for accelerating trunk girth safely.

### 1. The Shallow Pan Training Principle
When Adenium seedlings are grown in narrow, deep containers, their taproots dive vertically downwards searching for moisture. This produces a tall, slender carrot-shaped root rather than a dramatic radial spread.

To achieve the classic flat, fat Arabicum or Bonsai Obesum form:
- Transplant your 8-month-old seedling into a wide, shallow training tray (no deeper than 10-12 cm).
- Place a flat plastic disc or sterile ceramic tile directly beneath the severed taproot.
- Spread the lateral roots horizontally like the spokes of a bicycle wheel and secure them with soft bonsai wire or toothpicks.

### 2. High Mineral Porosity Over Rich Soil
A fatal misconception among beginners is that rich, organic garden soil makes plants grow faster. In reality, wet soggy compost rots root tissue before it can store starch.

Our plants build massive moisture-storage cells (parenchyma tissue) only when forced to adapt to rapid soak-and-dry cycles. Use at least 65% gritty mineral particles (pumice, crushed brick, river sand, charcoal) and only 35% compost.

### 3. The Biennial Root Lift
Every 18 to 24 months during the early March spring repotting window:
1. Carefully unpot your specimen and wash away old substrate.
2. Elevate the entire plant 2 to 4 centimeters higher than its previous soil line.
3. Repot with the newly exposed upper root flares now visible to the open air and sunlight.

Within 60 days of sun exposure, the pale green exposed roots will develop thick, corky bark and thicken substantially, expanding your plant''s visual diameter.
    ',
  'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=1200&auto=format&fit=crop',
  'Master Horticulturist, Pak Adenium',
  6,
  TRUE,
  'How to Fatten Adenium Caudex in Pakistan | Nursery Guide',
  'Expert guide on growing massive swollen Adenium caudexes using root training, shallow pots, and Pakistan heat cycles.',
  '2026-11-05T09:57:51.356Z',
  '2026-11-19T09:57:51.356Z'
) ON CONFLICT (id) DO NOTHING;

-- Article [2/3]: Monsoon Survival Protocol: Protecting Desert Roses from Humid Root Rot
INSERT INTO public.articles (
  id, title, slug, category, excerpt, content, featured_image,
  author_name, read_time_minutes, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'e0000001-0000-0000-0000-000000000002',
  'Monsoon Survival Protocol: Protecting Desert Roses from Humid Root Rot',
  'monsoon-survival-protocol-adenium-rot-prevention',
  'Seasonal Care',
  'Critical strategies for safeguarding your valuable Adenium collection during July-August heavy rainfall and extreme humidity.',
  '
## The Monsoon Challenge for Desert Succulents

Adenium species are naturally adapted to arid semi-desert regions of Southern Arabia, Yemen, Socotra, and East Africa where rain falls in brief, torrential bursts followed by drying winds and scorching sun.

The South Asian monsoon (July through late August) presents the exact opposite conditions: days of relentless overcast humidity, high ambient moisture, and waterlogged soil. This is the single highest-risk season for fungal stem and root rot (*Fusarium* and *Phytophthora*).

### The Golden Rule: Top Canopy Shelter
If you have high-value grafted specimens or mature Arabicums:
- Keep them outdoors under a clear UV-stabilized polycarbonate sheet, fiberglass awning, or transparent plastic shelter.
- **Do not bring plants into dark indoor rooms.** Reduced light weakens their vascular defense mechanism. Plants need maximum ambient daylight while keeping excessive rain off their root balls.

### Air Circulation is Your Best Fungicide
Humidity stagnates when pots are crammed wall-to-wall on the ground:
- Place pots on elevated benches or iron stands at least 45 cm above ground level.
- Ensure minimum 20 cm spacing between plant foliage so breeze can dry damp stems within hours.

### What To Do If You Detect Soft Caudex Tissue
Check your plants every morning. Touch the caudex gently with your thumb:
1. **Firm and rigid:** Healthy.
2. **Soft or spongy:** Stop watering immediately and inspect the soil.
3. **Brown discoloration or oozing:** Remove the plant from the pot immediately. Using a sterile surgical razor, carve away all brown mushy tissue until only clean, pristine white-green vegetable matter remains. Dust the wound heavily with systemic cinnamon powder or copper-based fungicide, and let the plant air-dry in the shade for 7 to 10 days before repotting in dry pumice.
    ',
  'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=1200&auto=format&fit=crop',
  'Tariq Mahmood, Head Propagator',
  5,
  TRUE,
  'Monsoon Care for Adenium in Pakistan | Rot Prevention Guide',
  'Protect Adenium Desert Rose plants during monsoon rain in Pakistan. How to treat soft caudex, fungal rot, and improve airflow.',
  '2026-10-22T09:57:51.356Z',
  '2026-11-19T09:57:51.356Z'
) ON CONFLICT (id) DO NOTHING;

-- Article [3/3]: Winter Dormancy Management: What To Do Between November & February
INSERT INTO public.articles (
  id, title, slug, category, excerpt, content, featured_image,
  author_name, read_time_minutes, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'e0000001-0000-0000-0000-000000000003',
  'Winter Dormancy Management: What To Do Between November & February',
  'winter-dormancy-management-pakistan',
  'Seasonal Care',
  'How to manage leaf drop, cold protection, and zero-water cycles when temperatures plunge below 10°C in Northern & Central Pakistan.',
  '
## Understanding Deciduous Winter Rest

As day length shortens and nighttime temperatures plunge in November across Islamabad, Lahore, Multan, and Peshawar, your Adenium will naturally turn its lower leaves yellow and shed them.

**Do not panic.** This is not a dying plant; it is a natural biological survival mechanism to prevent water evaporation during cold weather.

### The Number One Cause of Winter Death: Cold + Wet Soil
An Adenium can tolerate temperatures down to 4°C if its soil is bone dry. However, an Adenium sitting in cold, wet soil at 10°C will rot its entire root structure in under a week.

### The Winter Care Rules:
1. **Cut watering by 90%:** From late November until mid-February, water only once every 3 to 4 weeks, and only on a bright, sunny morning.
2. **Never water on overcast or foggy days:** If morning smog or cold fog persists, withhold water completely.
3. **Protect from morning frost:** In regions where morning frost occurs (Upper Punjab, KP, Potohar), keep plants under porch overhangs or cover with agricultural fleece at night. Remove fleece during midday sun.
4. **Spring Awakening:** When night temperatures consistently rise above 18°C in late February, prune elongated leggy stems and give the first deep soaking with a balanced micro-nutrient feed.
    ',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop',
  'Master Horticulturist, Pak Adenium',
  5,
  TRUE,
  'Adenium Winter Care in Pakistan | Dormancy & Frost Protection',
  'Complete guide to winter dormancy for Desert Rose plants in Pakistan. Proper watering schedules, frost protection, and spring pruning.',
  '2026-10-05T09:57:51.356Z',
  '2026-11-19T09:57:51.356Z'
) ON CONFLICT (id) DO NOTHING;

-- ==================================================================
-- 2. CONTENT SECTIONS TABLE (0 records)
-- ==================================================================

-- (No content_sections defined in data/database.json)

-- ==================================================================
-- 3. ORDERS TABLE (3 records)
-- ==================================================================

-- Order [1/3]: PAK-2620 (Usama Ahmed)
INSERT INTO public.orders (
  id, order_number, customer_name, customer_phone, customer_whatsapp, customer_email,
  province, city, area, shipping_address, order_notes, admin_notes,
  subtotal, shipping_fee, discount, total, payment_method, payment_status, order_status,
  tracking_number, courier_name, created_at, updated_at
) VALUES (
  'd0000001-0000-0000-0000-000000000001',
  'PAK-2620',
  'Usama Ahmed',
  '5645765876878',
  '657657657656',
  'usamaahmed7ctech@gmail.com',
  'Khyber Pakhtunkhwa',
  'Peshawar',
  'Karachi',
  'Karachi
Akhter Colony',
  '',
  '',
  31800,
  0,
  0,
  31800,
  'Cash on Delivery',
  'Refunded',
  'Cancelled',
  NULL,
  NULL,
  '2026-11-19T12:57:14.721Z',
  '2026-11-19T12:59:01.602Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (
  id, order_id, product_id, product_name, product_sku, unit_price, quantity, total_price, image_url, created_at
) VALUES (
  'd0000002-0000-0000-0000-000000000001',
  'd0000001-0000-0000-0000-000000000001',
  'a0000001-0000-0000-0000-000000000001',
  'Dorset Horn Adenium ''Khao Hin Khon''',
  'PAK-DH-001',
  8500,
  1,
  8500,
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=1200&auto=format&fit=crop',
  '2026-11-19T12:57:14.721Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.order_items (
  id, order_id, product_id, product_name, product_sku, unit_price, quantity, total_price, image_url, created_at
) VALUES (
  'd0000002-0000-0000-0000-000000000002',
  'd0000001-0000-0000-0000-000000000001',
  'a0000001-0000-0000-0000-000000000002',
  'Triple Black King (Velvet Midnight)',
  'PAK-GR-002',
  4800,
  1,
  4800,
  'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1200&auto=format&fit=crop',
  '2026-11-19T12:57:14.721Z'
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.order_items (
  id, order_id, product_id, product_name, product_sku, unit_price, quantity, total_price, image_url, created_at
) VALUES (
  'd0000002-0000-0000-0000-000000000003',
  'd0000001-0000-0000-0000-000000000001',
  'a0000001-0000-0000-0000-000000000003',
  'Super Baobab Arabicum Specimen',
  'PAK-AR-003',
  18500,
  1,
  18500,
  'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=1200&auto=format&fit=crop',
  '2026-11-19T12:57:14.721Z'
) ON CONFLICT (id) DO NOTHING;

-- Order [2/3]: PAK-2607 (Zainab Bokhari)
INSERT INTO public.orders (
  id, order_number, customer_name, customer_phone, customer_whatsapp, customer_email,
  province, city, area, shipping_address, order_notes, admin_notes,
  subtotal, shipping_fee, discount, total, payment_method, payment_status, order_status,
  tracking_number, courier_name, created_at, updated_at
) VALUES (
  'd0000001-0000-0000-0000-000000000002',
  'PAK-2607',
  'Zainab Bokhari',
  '03215551234',
  '923215551234',
  'zainab@example.pk',
  'Punjab',
  'Rawalpindi',
  'Bahria Town Phase 4',
  'House 112, Street 9, Sector B',
  'Bare-root dispatch requested',
  '',
  8500,
  0,
  0,
  8500,
  'Cash on Delivery',
  'Pending',
  'Pending',
  NULL,
  NULL,
  '2026-11-19T10:05:36.718Z',
  '2026-11-19T10:05:36.718Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (
  id, order_id, product_id, product_name, product_sku, unit_price, quantity, total_price, image_url, created_at
) VALUES (
  'd0000002-0000-0000-0000-000000000004',
  'd0000001-0000-0000-0000-000000000002',
  'a0000001-0000-0000-0000-000000000001',
  'Dorset Horn Adenium ''Khao Hin Khon''',
  'PAK-DH-001',
  8500,
  1,
  8500,
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=1200&auto=format&fit=crop',
  '2026-11-19T10:05:36.718Z'
) ON CONFLICT (id) DO NOTHING;

-- Order [3/3]: PAK-2601 (Haris Qureshi)
INSERT INTO public.orders (
  id, order_number, customer_name, customer_phone, customer_whatsapp, customer_email,
  province, city, area, shipping_address, order_notes, admin_notes,
  subtotal, shipping_fee, discount, total, payment_method, payment_status, order_status,
  tracking_number, courier_name, created_at, updated_at
) VALUES (
  'd0000001-0000-0000-0000-000000000003',
  'PAK-2601',
  'Haris Qureshi',
  '03009876543',
  '923009876543',
  'haris.q@example.pk',
  'Punjab',
  'Lahore',
  'DHA Phase 6',
  'House 42, Sector C, Street 8, DHA Phase 6',
  'Please deliver on Saturday if possible.',
  'Customer confirmed via WhatsApp call.',
  9500,
  0,
  0,
  9500,
  'Bank Transfer',
  'Verified',
  'Confirmed',
  NULL,
  NULL,
  '2026-11-17T09:57:51.477Z',
  '2026-11-17T09:57:51.477Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (
  id, order_id, product_id, product_name, product_sku, unit_price, quantity, total_price, image_url, created_at
) VALUES (
  'd0000002-0000-0000-0000-000000000005',
  'd0000001-0000-0000-0000-000000000003',
  'a0000001-0000-0000-0000-000000000001',
  'Dorset Horn Adenium ''Khao Hin Khon''',
  'PAK-DH-001',
  9500,
  1,
  9500,
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=1200&auto=format&fit=crop',
  '2026-11-17T09:57:51.477Z'
) ON CONFLICT (id) DO NOTHING;

-- ==================================================================
-- 5. REVIEWS TABLE (3 records)
-- ==================================================================

-- Review [1/3] for product prod-dorset-horn
INSERT INTO public.reviews (
  id, product_id, customer_name, rating, comment, verified_purchase, is_approved, created_at
) VALUES (
  'f0000001-0000-0000-0000-000000000001',
  'a0000001-0000-0000-0000-000000000001',
  'Khurram Shahzad (Lahore)',
  5,
  'Received the Khao Hin Khon specimen in impeccable condition. The caudex is super healthy and the horn curl on the leaves is distinct and genuine. Packed with exceptional care.',
  TRUE,
  TRUE,
  '2026-11-07T09:57:51.356Z'
) ON CONFLICT (id) DO NOTHING;

-- Review [2/3] for product prod-triple-black-king
INSERT INTO public.reviews (
  id, product_id, customer_name, rating, comment, verified_purchase, is_approved, created_at
) VALUES (
  'f0000001-0000-0000-0000-000000000002',
  'a0000001-0000-0000-0000-000000000002',
  'Dr. Ayesha Malik (Karachi)',
  5,
  'The bloom on this Black King is sensational. The dark velvet hue is even richer than the pictures. It flowered within 3 weeks of arrival.',
  TRUE,
  TRUE,
  '2026-11-10T09:57:51.356Z'
) ON CONFLICT (id) DO NOTHING;

-- Review [3/3] for product prod-super-baobab-arabicum
INSERT INTO public.reviews (
  id, product_id, customer_name, rating, comment, verified_purchase, is_approved, created_at
) VALUES (
  'f0000001-0000-0000-0000-000000000003',
  'a0000001-0000-0000-0000-000000000003',
  'Salman Tariq (Islamabad)',
  5,
  'A true collector piece. The trunk girth is massive and roots were trained impeccably. Delivered via Daewoo cargo safely without a single leaf bruised.',
  TRUE,
  TRUE,
  '2026-11-14T09:57:51.356Z'
) ON CONFLICT (id) DO NOTHING;

