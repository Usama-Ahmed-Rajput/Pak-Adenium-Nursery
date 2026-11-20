-- ==================================================================
-- SEED PRODUCTS & PRODUCT IMAGES FOR PAK ADENIUM NURSERY
-- Generated from data/database.json
-- Total Products: 9
-- ==================================================================

-- Product [1/9]: Dorset Horn Adenium 'Khao Hin Khon' (PAK-DH-001)
INSERT INTO public.products (
  id, name, slug, sku, category_id, species, variety, flower_color, petal_type,
  price, sale_price, stock_quantity, low_stock_threshold, caudex_size, plant_age,
  is_grafted, pot_size, description, care_watering, care_sunlight, care_temperature,
  care_soil, seasonal_notes, is_featured, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'a0000001-0000-0000-0000-000000000001',
  'Dorset Horn Adenium ''Khao Hin Khon''',
  'dorset-horn-adenium-khao-hin-khon',
  'PAK-DH-001',
  'c0000001-0000-0000-0000-000000000003',
  'Adenium Hybrid',
  'Dorset Horn Khao Hin Khon',
  'Soft Pink Star',
  'Single',
  9500,
  8500,
  20,
  2,
  'Compact Swollen Base (14cm circumference)',
  '3 Years',
  FALSE,
  '6-inch Unglazed Terracotta',
  'An authentic, naturally mutated collector specimen characterized by dramatic tightly curled, ram-horn styled foliage and dense internodal branching. Grown from verified Thai lineage, acclimated to local outdoor Punjab heat.',
  'Allow potting medium to dry out 100% between thorough waterings. Reduce to once every 18-21 days during peak winter dormancy (Dec-Jan).',
  'Minimum 6-8 hours of direct full sun. Intense sun is essential to maintain tight horn curls on new leaves.',
  'Ideal 25°C to 44°C. Protect under porch canopy or green net when winter overnight temps drop below 8°C in northern/central Pakistan.',
  'Ultra-coarse gritty blend: 40% pumice/cinder, 30% coarse river sand, 20% coco chips, 10% aged cow manure.',
  'Leaves may partially drop in December; resumes vigorous compact growth as temperatures climb in mid-February.',
  TRUE,
  TRUE,
  'Dorset Horn Adenium Collector Specimen | Pak Adenium Nursery',
  'Buy rare genuine Dorset Horn Adenium with curling ram-horn foliage in Pakistan. Hardy, acclimated specimen with thick swollen caudex.',
  '2026-10-20T09:57:51.355Z',
  '2026-11-19T13:03:15.456Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000001',
  'a0000001-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=1200&auto=format&fit=crop',
  'Dorset Horn Adenium ram-horn curled foliage',
  TRUE,
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000002',
  'a0000001-0000-0000-0000-000000000001',
  'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=1200&auto=format&fit=crop',
  'Dorset Horn bonsai container specimen',
  FALSE,
  2
) ON CONFLICT (id) DO NOTHING;

-- Product [2/9]: Triple Black King (Velvet Midnight) (PAK-GR-002)
INSERT INTO public.products (
  id, name, slug, sku, category_id, species, variety, flower_color, petal_type,
  price, sale_price, stock_quantity, low_stock_threshold, caudex_size, plant_age,
  is_grafted, pot_size, description, care_watering, care_sunlight, care_temperature,
  care_soil, seasonal_notes, is_featured, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'a0000001-0000-0000-0000-000000000002',
  'Triple Black King (Velvet Midnight)',
  'triple-black-king-velvet-midnight',
  'PAK-GR-002',
  'c0000001-0000-0000-0000-000000000001',
  'Adenium Obesum',
  'Black King Triple Layer',
  'Deep Velvet Dark Crimson-Black',
  'Triple Layer',
  5200,
  4800,
  7,
  3,
  'Medium-Heavy (18cm circumference)',
  '2.5 Years',
  TRUE,
  '8-inch Deep Nursery Pot',
  'One of the most dramatic flowering varieties in cultivation. Triple-layered velvet petals transition from an intense oxblood heart to an ultra-dark near-black outer rim. Grafted onto a vigorous, drought-hardened rootstock.',
  'Water deeply when top 3 inches of soil feel bone dry. Avoid overhead watering directly on flower buds to prevent petal spotting.',
  'Full morning to afternoon sun. 6+ hours required for deep velvet pigmentation.',
  'Thrives in Pakistan''s high summer heat (30°C - 45°C). Bring indoors or shelter if frost threatens.',
  'Freely draining succulent mix with crushed brick chips, leaf mold, perlite, and coarse sand.',
  'Flushes heavily in spring (March-May) and again in post-monsoon autumn (September-November).',
  TRUE,
  TRUE,
  'Triple Black King Grafted Desert Rose | Pak Adenium',
  'Order Triple Black King Desert Rose plant online in Pakistan. Exotic dark velvet multi-layer blooms on hardy caudex rootstock.',
  '2026-10-25T09:57:51.356Z',
  '2026-11-19T12:57:14.721Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000003',
  'a0000001-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1200&auto=format&fit=crop',
  'Triple Black King dark velvet crimson bloom',
  TRUE,
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000004',
  'a0000001-0000-0000-0000-000000000002',
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200&auto=format&fit=crop',
  'Multi-layer petal structure in sunlight',
  FALSE,
  2
) ON CONFLICT (id) DO NOTHING;

-- Product [3/9]: Super Baobab Arabicum Specimen (PAK-AR-003)
INSERT INTO public.products (
  id, name, slug, sku, category_id, species, variety, flower_color, petal_type,
  price, sale_price, stock_quantity, low_stock_threshold, caudex_size, plant_age,
  is_grafted, pot_size, description, care_watering, care_sunlight, care_temperature,
  care_soil, seasonal_notes, is_featured, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'a0000001-0000-0000-0000-000000000003',
  'Super Baobab Arabicum Specimen',
  'super-baobab-arabicum-specimen',
  'PAK-AR-003',
  'c0000001-0000-0000-0000-000000000002',
  'Adenium Arabicum',
  'Super Baobab Dwarf Form',
  'Pale Pink with White Throat',
  'Single',
  18500,
  NULL,
  2,
  1,
  'Monumental Caudex (32cm circumference)',
  '5.5 Years',
  FALSE,
  '12-inch Artisan Bonsai Shallow Pan',
  'A breathtaking living sculpture. Trained over five seasons to form a stout, baobab-mimicking elephant trunk caudex with multiple horizontal branch tiers and silken silvery bark. Grown from original non-grafted seed stock.',
  'Sparingly during growth season. In shallow bonsai containers, saturate thoroughly until water streams from drainage holes, then leave until substrate is completely dry.',
  'Unfiltered full sun from sunrise to sunset. Essential for keeping branch nodes short and thick.',
  'Extremely heat-tolerant up to 48°C. Keep dry during cool northern winters.',
  'Bonsai mineral substrate: 50% pumice/scoria, 30% akadama/baked clay, 20% organic compost.',
  'Trained roots are raised slightly at each biennial repotting to reveal dramatic underground caudex contours.',
  TRUE,
  TRUE,
  'Super Baobab Arabicum Bonsai Specimen | Pak Adenium Nursery',
  'Massive 5-year-old Adenium Arabicum Super Baobab specimen plant. Sculptural swollen caudex, mature bonsai form.',
  '2026-10-30T09:57:51.356Z',
  '2026-11-19T12:57:14.721Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000005',
  'a0000001-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=1200&auto=format&fit=crop',
  'Adenium Arabicum Super Baobab swollen caudex',
  TRUE,
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000006',
  'a0000001-0000-0000-0000-000000000003',
  'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1200&auto=format&fit=crop',
  'Radial canopy and horizontal bonsai branching',
  FALSE,
  2
) ON CONFLICT (id) DO NOTHING;

-- Product [4/9]: White Diamond (Pristine Triple Bloom) (PAK-GR-004)
INSERT INTO public.products (
  id, name, slug, sku, category_id, species, variety, flower_color, petal_type,
  price, sale_price, stock_quantity, low_stock_threshold, caudex_size, plant_age,
  is_grafted, pot_size, description, care_watering, care_sunlight, care_temperature,
  care_soil, seasonal_notes, is_featured, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'a0000001-0000-0000-0000-000000000004',
  'White Diamond (Pristine Triple Bloom)',
  'white-diamond-pristine-triple-bloom',
  'PAK-GR-004',
  'c0000001-0000-0000-0000-000000000001',
  'Adenium Obesum',
  'White Diamond Triple',
  'Pristine Snow White with Lime Throat',
  'Triple Layer',
  4900,
  4200,
  11,
  4,
  'Medium (16cm circumference)',
  '2 Years',
  TRUE,
  '7.5-inch Nursery Pot',
  'Pure botanical elegance. Triple-layered camellia-like pure white petals with a subtle fresh lime heart that remains colorfast even under intense Pakistan sun without yellowing.',
  'Allow soil to dry between waterings. Protect white petals from direct monsoon shower downpours to preserve pristine bloom texture.',
  'Bright full sunlight or light afternoon 15% filtered shade during peak June extremes.',
  'Ideal 22°C to 40°C.',
  'Porous blend of river sand, coco chips, burnt rice husk, and garden loam.',
  'Continuous bloom producer through summer and early autumn months.',
  FALSE,
  TRUE,
  'White Diamond Triple Petal Adenium | Pak Adenium',
  'Pure white multi-petal grafted Desert Rose in Pakistan. High flower count, sun-fast pristine white blooms.',
  '2026-11-01T09:57:51.356Z',
  '2026-11-19T09:57:51.356Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000007',
  'a0000001-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1598880940371-c756e015fea1?q=80&w=1200&auto=format&fit=crop',
  'White Diamond pure white multi-layer blossom',
  TRUE,
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000008',
  'a0000001-0000-0000-0000-000000000004',
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=1200&auto=format&fit=crop',
  'Detailed view of ruffled white petals',
  FALSE,
  2
) ON CONFLICT (id) DO NOTHING;

-- Product [5/9]: Star of Pakistan (Ruby & Gold Bi-Color) (PAK-HY-005)
INSERT INTO public.products (
  id, name, slug, sku, category_id, species, variety, flower_color, petal_type,
  price, sale_price, stock_quantity, low_stock_threshold, caudex_size, plant_age,
  is_grafted, pot_size, description, care_watering, care_sunlight, care_temperature,
  care_soil, seasonal_notes, is_featured, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'a0000001-0000-0000-0000-000000000005',
  'Star of Pakistan (Ruby & Gold Bi-Color)',
  'star-of-pakistan-ruby-gold-bi-color',
  'PAK-HY-005',
  'c0000001-0000-0000-0000-000000000001',
  'Adenium Hybrid',
  'Star of Pakistan Select',
  'Magenta Ruby with Warm Golden Star Center',
  'Double Layer',
  6200,
  5500,
  6,
  2,
  'Medium-Heavy (20cm circumference)',
  '2.5 Years',
  TRUE,
  '8-inch Terracotta Bowl',
  'A signature proprietary nursery hybrid developed right here in our Multan growing grounds. Features double ruffled petals of glowing magenta-ruby radiating outward from an amber gold starburst center.',
  'Moderate watering in spring and summer. Withhold water when leaves begin yellowing before winter rest.',
  'Full sun. The golden center deepens dramatically with high UV exposure.',
  'Very hardy in dry subtropical climates (tested up to 47°C).',
  'Gritty succulent medium with charcoal bits to prevent root fungal issues.',
  'One of our earliest spring bloomers, bursting into bud in late February.',
  TRUE,
  TRUE,
  'Star of Pakistan Bi-Color Desert Rose | Pak Adenium Signature',
  'Exclusive Pakistani bred Desert Rose with magenta ruby petals and gold star throat. Hardy grafted specimen plant.',
  '2026-11-04T09:57:51.356Z',
  '2026-11-19T09:57:51.356Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000009',
  'a0000001-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1589782182703-2aaa69037b5b?q=80&w=1200&auto=format&fit=crop',
  'Star of Pakistan ruby and gold star bloom',
  TRUE,
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000010',
  'a0000001-0000-0000-0000-000000000005',
  'https://images.unsplash.com/photo-1516048015710-7a3b4c86be43?q=80&w=1200&auto=format&fit=crop',
  'Crown branch loaded with flowering buds',
  FALSE,
  2
) ON CONFLICT (id) DO NOTHING;

-- Product [6/9]: Thai Socotranum 'Golden Crown' Bonsai (PAK-SO-006)
INSERT INTO public.products (
  id, name, slug, sku, category_id, species, variety, flower_color, petal_type,
  price, sale_price, stock_quantity, low_stock_threshold, caudex_size, plant_age,
  is_grafted, pot_size, description, care_watering, care_sunlight, care_temperature,
  care_soil, seasonal_notes, is_featured, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'a0000001-0000-0000-0000-000000000006',
  'Thai Socotranum ''Golden Crown'' Bonsai',
  'thai-socotranum-golden-crown-bonsai',
  'PAK-SO-006',
  'c0000001-0000-0000-0000-000000000005',
  'Adenium Socotranum Hybrid',
  'Golden Crown (Kha-Khae)',
  'Pale Rose Pink with Striped Throat',
  'Single',
  24500,
  NULL,
  2,
  1,
  'Extra Heavy Bonsai (38cm circumference)',
  '6 Years',
  FALSE,
  '14-inch Handmade Glazed Bonsai Tray',
  'An extraordinary master-tier bonsai specimen. Features characteristic golden-sheened columnar caudex bark, vertical tower branches, and a natural octagonal radial root formation spread over a display stone.',
  'Precise moisture control. Water only when the entire potting medium is dry and the caudex shows slight give under gentle finger pressure.',
  'Maximum sunlight exposure. Rotate pot 90 degrees monthly to maintain symmetrical branch architecture.',
  'Shelter in unheated bright indoor room or plastic greenhouse during cold wet winter periods.',
  '60% pumice, 20% volcanic rock, 10% red brick chips, 10% composted bark.',
  'Specimen of a lifetime. Includes ceramic display pot and hand-trimmed root architecture.',
  TRUE,
  TRUE,
  'Thai Socotranum Golden Crown Bonsai | Pak Adenium',
  'Rare 6-year trained Thai Socotranum Golden Crown master bonsai Adenium. Hand-delivered across Pakistan with custom packaging.',
  '2026-11-07T09:57:51.356Z',
  '2026-11-19T09:57:51.356Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000011',
  'a0000001-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=1200&auto=format&fit=crop',
  'Thai Socotranum Golden Crown mature bonsai',
  TRUE,
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000012',
  'a0000001-0000-0000-0000-000000000006',
  'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?q=80&w=1200&auto=format&fit=crop',
  'Octagonal root flare across display tray',
  FALSE,
  2
) ON CONFLICT (id) DO NOTHING;

-- Product [7/9]: Desert Sunset (Warm Apricot Yellow) (PAK-GR-007)
INSERT INTO public.products (
  id, name, slug, sku, category_id, species, variety, flower_color, petal_type,
  price, sale_price, stock_quantity, low_stock_threshold, caudex_size, plant_age,
  is_grafted, pot_size, description, care_watering, care_sunlight, care_temperature,
  care_soil, seasonal_notes, is_featured, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'a0000001-0000-0000-0000-000000000007',
  'Desert Sunset (Warm Apricot Yellow)',
  'desert-sunset-warm-apricot-yellow',
  'PAK-GR-007',
  'c0000001-0000-0000-0000-000000000001',
  'Adenium Obesum',
  'Sunset Gold Layered',
  'Soft Honey Yellow with Coral Margin',
  'Double Layer',
  5800,
  NULL,
  5,
  2,
  'Medium (17cm circumference)',
  '2 Years',
  TRUE,
  '8-inch Nursery Pot',
  'Yellow is among the most sought-after and challenging pigment traits in Adenium horticulture. Desert Sunset yields glowing warm apricot-yellow blooms with delicate coral flushes along the wavy petal rims.',
  'Regular soaking once or twice weekly in summer heat. Stop in winter.',
  'Prefers bright morning sun. Slight midday shade preserves the subtle pastel yellow intensity.',
  '24°C to 42°C.',
  'Porous mineral and organic succulent blend.',
  'Grafted on healthy multi-branch seedling stock with well-developed taproot.',
  FALSE,
  TRUE,
  'Yellow Adenium Grafted Plant | Pak Adenium Nursery',
  'Buy yellow blooming Desert Rose plant in Pakistan. Rare pastel apricot and honey yellow grafted variety.',
  '2026-11-09T09:57:51.356Z',
  '2026-11-19T09:57:51.356Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000013',
  'a0000001-0000-0000-0000-000000000007',
  'https://images.unsplash.com/photo-1507290439931-a861b5a38200?q=80&w=1200&auto=format&fit=crop',
  'Desert Sunset warm apricot yellow blooms',
  TRUE,
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000014',
  'a0000001-0000-0000-0000-000000000007',
  'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1200&auto=format&fit=crop',
  'Pastel yellow flowers with coral margins',
  FALSE,
  2
) ON CONFLICT (id) DO NOTHING;

-- Product [8/9]: Hand-Pollinated Hybrid Seeds (Pack of 20) (PAK-SD-008)
INSERT INTO public.products (
  id, name, slug, sku, category_id, species, variety, flower_color, petal_type,
  price, sale_price, stock_quantity, low_stock_threshold, caudex_size, plant_age,
  is_grafted, pot_size, description, care_watering, care_sunlight, care_temperature,
  care_soil, seasonal_notes, is_featured, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'a0000001-0000-0000-0000-000000000008',
  'Hand-Pollinated Hybrid Seeds (Pack of 20)',
  'hand-pollinated-hybrid-seeds-pack-20',
  'PAK-SD-008',
  'c0000001-0000-0000-0000-000000000006',
  'Adenium Obesum & Arabicum',
  'Parent Lineage: Multi-Petal & Fat Caudex Crosses',
  'Assorted Genetic Mix',
  'Variable',
  1800,
  1500,
  25,
  5,
  'Seed Pod Origin',
  'Fresh 2026 Harvest',
  FALSE,
  'Air-sealed Foil Packet',
  'Harvested directly from our mother specimen collection in early spring 2026. Hand-pollinated between award-winning multi-petal pollen parents and heavy caudex seed parents. Tested 85%+ germination rate within 7-10 days.',
  'Keep seedling germination medium evenly moist (not waterlogged) using a fine mist spray.',
  'Filtered warm light until first true set of leaves emerge, then gradually expose to gentle morning sun.',
  'Requires 28°C to 34°C bottom warmth for rapid sprout germination.',
  '50% fine coco peat + 50% coarse perlite or river sand.',
  'Includes printed germination instruction guide with our nursery''s seed-starting protocol.',
  FALSE,
  TRUE,
  'Fresh Adenium Seeds Online Pakistan | Pak Adenium',
  'Buy fresh hand-pollinated Adenium seeds in Pakistan. 85%+ germination rate, hybrid multi-petal parentage.',
  '2026-11-11T09:57:51.356Z',
  '2026-11-19T09:57:51.356Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000015',
  'a0000001-0000-0000-0000-000000000008',
  'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?q=80&w=1200&auto=format&fit=crop',
  'Fresh hand-pollinated Adenium seed pods and seeds',
  TRUE,
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000016',
  'a0000001-0000-0000-0000-000000000008',
  'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?q=80&w=1200&auto=format&fit=crop',
  'Seedling propagation tray with swollen taproots',
  FALSE,
  2
) ON CONFLICT (id) DO NOTHING;

-- Product [9/9]: Artisan Coarse Mineral Substrate (5kg Bag) (PAK-MED-009)
INSERT INTO public.products (
  id, name, slug, sku, category_id, species, variety, flower_color, petal_type,
  price, sale_price, stock_quantity, low_stock_threshold, caudex_size, plant_age,
  is_grafted, pot_size, description, care_watering, care_sunlight, care_temperature,
  care_soil, seasonal_notes, is_featured, is_published, seo_title, seo_description,
  created_at, updated_at
) VALUES (
  'a0000001-0000-0000-0000-000000000009',
  'Artisan Coarse Mineral Substrate (5kg Bag)',
  'artisan-coarse-mineral-substrate-5kg',
  'PAK-MED-009',
  'c0000001-0000-0000-0000-000000000006',
  'Botanical Growing Media',
  'Pak Adenium Master Formulation',
  'N/A',
  'N/A',
  1450,
  NULL,
  40,
  10,
  '5kg Sealed Heavy Bag',
  'Sterilized & Sieved',
  FALSE,
  'Pre-mixed substrate',
  'The exact substrate recipe we use in our nursery to prevent caudex root rot in Pakistan''s summer monsoon and humid weather. Custom-sieved volcanic pumice, lava gravel, baked clay granulate, washed river gravel, and bio-char.',
  'Water flushes straight through drainage holes in 3 seconds, eliminating standing moisture around root collars.',
  'N/A',
  'Stable mineral media that does not decompose or compact over 3+ years.',
  'Sieved to 3mm - 6mm particle size. Zero dust.',
  'Perfect for repotting adult Adeniums and root training bonsai forms.',
  FALSE,
  TRUE,
  'Adenium Soil Mix Pakistan | Coarse Bonsai Media | Pak Adenium',
  'Fast draining mineral potting mix for Desert Rose plants in Pakistan. Prevents caudex rot, formulated for monsoon climate.',
  '2026-11-14T09:57:51.356Z',
  '2026-11-19T13:03:30.065Z'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000017',
  'a0000001-0000-0000-0000-000000000009',
  'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?q=80&w=1200&auto=format&fit=crop',
  'Artisan mineral substrate for Desert Rose caudex',
  TRUE,
  1
) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order) VALUES (
  'b0000001-0000-0000-0000-000000000018',
  'a0000001-0000-0000-0000-000000000009',
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1200&auto=format&fit=crop',
  'Fast-draining pumice and volcanic lava granulate',
  FALSE,
  2
) ON CONFLICT (id) DO NOTHING;

