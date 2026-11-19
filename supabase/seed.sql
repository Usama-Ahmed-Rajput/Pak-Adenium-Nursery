-- ========================================================================
-- PAK ADENIUM NURSERY — SEED DATA (BOTANICAL SPECIMENS & INITIAL CONTENT)
-- ========================================================================

-- CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, display_order, is_active) VALUES
('c0000001-0000-0000-0000-000000000001', 'Grafted Varieties', 'grafted-varieties', 'Exquisite multi-petal layered blooms grafted onto robust 2-3 year acclimated rootstocks.', 'https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop', 1, true),
('c0000001-0000-0000-0000-000000000002', 'Adenium Arabicum', 'adenium-arabicum', 'Prized for massive, sculptural caudex formations, wide branching, and natural bonsai silhouettes.', 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=1200&auto=format&fit=crop', 2, true),
('c0000001-0000-0000-0000-000000000003', 'Rare & Collector Hybrids', 'rare-collector-hybrids', 'Limited botanical treasures including Dorset Horn, Thai Socotranum, and variegated foliage.', 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=1200&auto=format&fit=crop', 3, true),
('c0000001-0000-0000-0000-000000000004', 'Adenium Obesum', 'adenium-obesum', 'The quintessential Desert Rose featuring resilient vigor and profuse seasonal flushes.', 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?q=80&w=1200&auto=format&fit=crop', 4, true),
('c0000001-0000-0000-0000-000000000005', 'Specimen Bonsai', 'specimen-bonsai', 'Mature 4 to 8 year root-trained Adeniums planted in custom artisan clay pottery.', 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?q=80&w=1200&auto=format&fit=crop', 5, true),
('c0000001-0000-0000-0000-000000000006', 'Seeds & Nursery Care', 'seeds-and-care', 'Hand-harvested fresh seed pods, specialized mineral potting mixes, and bonsai shears.', 'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?q=80&w=1200&auto=format&fit=crop', 6, true)
ON CONFLICT (id) DO NOTHING;

-- SITE SETTINGS
INSERT INTO public.site_settings (key, value, description) VALUES
('general', '{
  "nursery_name": "Pak Adenium",
  "tagline": "Living Sculptures. Grown With Care.",
  "founded_year": "2018",
  "phone": "+92 300 1234567",
  "whatsapp": "923001234567",
  "email": "inquiry@pakadenium.pk",
  "address": "Green Avenue, Nursery Farms, Multan / Lahore Highway, Pakistan",
  "currency": "PKR",
  "currency_symbol": "Rs."
}', 'Core business identity and contact details'),
('shipping', '{
  "default_shipping_fee": 350,
  "free_shipping_threshold": 6000,
  "courier_partners": ["TCS Express", "Leopards Courier", "Daewoo FastEx (Live Plants)"],
  "delivery_time_notes": "Live specimens are dispatched Mondays & Tuesdays to prevent transit weekend delays."
}', 'Logistics and delivery fees for Pakistan provinces'),
('payment_methods', '{
  "cod_enabled": true,
  "bank_transfer_enabled": true,
  "bank_title": "Pak Adenium Horticultural Farms",
  "bank_name": "Meezan Bank Limited",
  "account_number": "02010108928371",
  "iban": "PK45MEZN0002010108928371",
  "easypaisa_enabled": true,
  "easypaisa_number": "0300-1234567",
  "jazzcash_enabled": true,
  "jazzcash_number": "0300-1234567"
}', 'Pakistani payment gateway and manual settlement configurations'),
('announcement', '{
  "enabled": true,
  "text": "Spring 2026 Flowering Collection Now Unveiled — Nationwide Safe Bare-Root & Potted Dispatch",
  "link": "/shop",
  "bg_color": "#15271E",
  "text_color": "#FBF9F4"
}', 'Header announcement strip')
ON CONFLICT (key) DO NOTHING;

