export interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  display_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category_id: string;
  category_name?: string;
  species: string;
  variety: string;
  flower_color: string;
  petal_type: string;
  price: number;
  sale_price?: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  caudex_size: string;
  plant_age: string;
  is_grafted: boolean;
  pot_size: string;
  description: string;
  care_watering: string;
  care_sunlight: string;
  care_temperature: string;
  care_soil: string;
  seasonal_notes?: string;
  is_featured: boolean;
  is_published: boolean;
  seo_title?: string;
  seo_description?: string;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  product_count?: number;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  image_url?: string;
}

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Ready to Ship"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type PaymentStatus = "Pending" | "Verified" | "Paid" | "Failed" | "Refunded";

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  customer_email?: string;
  province: string;
  city: string;
  area?: string;
  shipping_address: string;
  order_notes?: string;
  admin_notes?: string;
  tracking_number?: string;
  courier_name?: string;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  payment_method: string;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author_name: string;
  read_time_minutes: number;
  is_published: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
}

export interface GeneralSettings {
  nursery_name: string;
  tagline: string;
  founded_year: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  currency: string;
  currency_symbol: string;
}

export interface ShippingSettings {
  default_shipping_fee: number;
  free_shipping_threshold: number;
  courier_partners: string[];
  delivery_time_notes: string;
}

export interface PaymentSettings {
  cod_enabled: boolean;
  bank_transfer_enabled: boolean;
  bank_title: string;
  bank_name: string;
  account_number: string;
  iban: string;
  easypaisa_enabled: boolean;
  easypaisa_number: string;
  jazzcash_enabled: boolean;
  jazzcash_number: string;
}

export interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  link: string;
  bg_color: string;
  text_color: string;
}

export interface HomepageSettings {
  hero_headline: string;
  hero_description: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_secondary_text: string;
  hero_secondary_link: string;
  story_badge: string;
  story_title: string;
  story_description: string;
}

export interface SeoSettings {
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  og_image: string;
}

export interface SocialSettings {
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

export interface SiteSettings {
  general: GeneralSettings;
  shipping: ShippingSettings;
  payment_methods: PaymentSettings;
  announcement: AnnouncementSettings;
  homepage: HomepageSettings;
  seo: SeoSettings;
  social: SocialSettings;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  email?: string;
  city: string;
  province: string;
  total_orders: number;
  total_spend: number;
  last_order_date: string;
  last_order_number: string;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  sale_price?: number | null;
  image: string;
  quantity: number;
  max_stock: number;
  species: string;
  flower_color?: string;
}

export interface PlantReview {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
  status: "New" | "Responded" | "Archived";
  created_at: string;
}

