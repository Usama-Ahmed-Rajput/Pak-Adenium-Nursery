-- ========================================================================
-- PAK ADENIUM NURSERY — ADMIN REPAIR & LOGISTICS MIGRATION
-- Migration: 20261119_admin_functionality_repair.sql
-- Description: Adds logistics tracking columns, modernizes RLS policies to TO authenticated,
-- and configures storage bucket policies for nursery media.
-- ========================================================================

-- 1. ADD TRACKING & COURIER COLUMNS TO ORDERS TABLE
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS courier_name VARCHAR(100);

-- Index for tracking lookups
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON public.orders(tracking_number);

-- 2. MODERNIZE RLS POLICIES (Supabase Best Practices: Replace auth.role() with TO authenticated)
DROP POLICY IF EXISTS "Admins full access to categories" ON public.categories;
CREATE POLICY "Admins full access to categories" ON public.categories 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to products" ON public.products;
CREATE POLICY "Admins full access to products" ON public.products 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to product images" ON public.product_images;
CREATE POLICY "Admins full access to product images" ON public.product_images 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to inventory logs" ON public.inventory_logs;
CREATE POLICY "Admins full access to inventory logs" ON public.inventory_logs 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to orders" ON public.orders;
CREATE POLICY "Admins full access to orders" ON public.orders 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to order items" ON public.order_items;
CREATE POLICY "Admins full access to order items" ON public.order_items 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to articles" ON public.articles;
CREATE POLICY "Admins full access to articles" ON public.articles 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to site settings" ON public.site_settings;
CREATE POLICY "Admins full access to site settings" ON public.site_settings 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to content sections" ON public.content_sections;
CREATE POLICY "Admins full access to content sections" ON public.content_sections 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to reviews" ON public.reviews;
CREATE POLICY "Admins full access to reviews" ON public.reviews 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Admins full access to inquiries" ON public.inquiries;
CREATE POLICY "Admins full access to inquiries" ON public.inquiries 
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. STORAGE PERMISSIONS FOR PRODUCT PHOTOGRAPHY (INSERT + SELECT + UPDATE + DELETE)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-media', 'product-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public media access" ON storage.objects;
CREATE POLICY "Public media access" ON storage.objects 
    FOR SELECT USING (bucket_id = 'product-media');

DROP POLICY IF EXISTS "Admin media insert" ON storage.objects;
CREATE POLICY "Admin media insert" ON storage.objects 
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-media');

DROP POLICY IF EXISTS "Admin media update" ON storage.objects;
CREATE POLICY "Admin media update" ON storage.objects 
    FOR UPDATE TO authenticated USING (bucket_id = 'product-media') WITH CHECK (bucket_id = 'product-media');

DROP POLICY IF EXISTS "Admin media delete" ON storage.objects;
CREATE POLICY "Admin media delete" ON storage.objects 
    FOR DELETE TO authenticated USING (bucket_id = 'product-media');

