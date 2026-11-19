-- ========================================================================
-- PAK ADENIUM NURSERY — SUPABASE MASTER DATABASE SCHEMA & RLS POLICIES
-- ========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    species VARCHAR(150) NOT NULL, -- e.g. Adenium Obesum, Adenium Arabicum, Adenium Socotranum
    variety VARCHAR(150),          -- e.g. Dorset Horn, Triple Black, Golden Crown
    flower_color VARCHAR(100),     -- e.g. Dark Red, Pure White, Yellow, Bi-Color
    petal_type VARCHAR(100),       -- e.g. Single Petal, Double Layer, Triple Layer, Rosette
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    sale_price NUMERIC(12, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 3 CHECK (low_stock_threshold >= 0),
    caudex_size VARCHAR(100),      -- e.g. Medium (12-15 cm girth), Massive Bonsai (30+ cm)
    plant_age VARCHAR(100),        -- e.g. 2.5 Years, 5+ Years Specimen
    is_grafted BOOLEAN DEFAULT false,
    pot_size VARCHAR(100),         -- e.g. 8-inch Terracotta, 12-inch Bonsai Tray, Bare Root
    description TEXT NOT NULL,
    care_watering TEXT,
    care_sunlight TEXT,
    care_temperature TEXT,
    care_soil TEXT,
    seasonal_notes TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. INVENTORY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    change_amount INT NOT NULL,
    previous_quantity INT NOT NULL,
    new_quantity INT NOT NULL,
    reason VARCHAR(255) NOT NULL, -- 'Restock', 'Order Fulfillment', 'Damage/Pruning', 'Manual Adjustment'
    reference_id VARCHAR(255),    -- Order number or batch reference
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_whatsapp VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    province VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    area VARCHAR(255),
    shipping_address TEXT NOT NULL,
    order_notes TEXT,
    admin_notes TEXT,
    subtotal NUMERIC(12, 2) NOT NULL,
    shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(100) NOT NULL, -- 'Cash on Delivery', 'Bank Transfer', 'EasyPaisa/JazzCash'
    payment_status VARCHAR(50) DEFAULT 'Pending' NOT NULL, -- 'Pending', 'Verified', 'Paid', 'Failed', 'Refunded'
    order_status VARCHAR(50) DEFAULT 'Pending' NOT NULL,   -- 'Pending', 'Confirmed', 'Processing', 'Ready to Ship', 'Shipped', 'Delivered', 'Cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_sku VARCHAR(100) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    total_price NUMERIC(12, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. PLANT CARE JOURNAL / ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT,
    author_name VARCHAR(100) DEFAULT 'Pak Adenium Master Horticulturist',
    read_time_minutes INT DEFAULT 5,
    is_published BOOLEAN DEFAULT true,
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. SITE SETTINGS TABLE (Key-Value configuration)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. CONTENT SECTIONS (Hero, Announcement, Philosophy, Story)
CREATE TABLE IF NOT EXISTS public.content_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section_key VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT,
    body TEXT,
    media_url TEXT,
    cta_text VARCHAR(100),
    cta_link VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    extra_data JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. REVIEWS TABLE (Organic customer reviews with moderation)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT false,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'New', -- 'New', 'Responded', 'Archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================================================
-- INDEXES FOR PERFORMANCE & FAST LOOKUPS
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Public can read active categories, published products, images, published articles, site settings, content sections, approved reviews
CREATE POLICY "Public can read active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read published products" ON public.products FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public can read published articles" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public can read content sections" ON public.content_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read approved reviews" ON public.reviews FOR SELECT USING (is_approved = true);

-- Public can create orders, order items, inquiries, and submit reviews
CREATE POLICY "Public can place orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can submit reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- Authenticated admins can manage everything
CREATE POLICY "Admins full access to categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to products" ON public.products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to product images" ON public.product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to inventory logs" ON public.inventory_logs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to orders" ON public.orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to order items" ON public.order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to articles" ON public.articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to site settings" ON public.site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to content sections" ON public.content_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to reviews" ON public.reviews FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admins full access to inquiries" ON public.inquiries FOR ALL USING (auth.role() = 'authenticated');

