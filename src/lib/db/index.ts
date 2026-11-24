import {
  Product,
  ProductImage,
  Category,
  Order,
  OrderItem,
  Article,
  SiteSettings,
  PlantReview,
  ContactInquiry,
  OrderStatus,
  PaymentStatus,
  Customer,
} from "@/types";
import { initialSiteSettings } from "./initialData";
import { supabase } from "@/lib/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/server";

// ==========================================
// HELPERS & MAPPERS
// ==========================================

function isUuid(val: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
}

function mapProduct(row: any): Product {
  const rawImages = Array.isArray(row.product_images)
    ? row.product_images
    : Array.isArray(row.images)
    ? row.images
    : [];

  const sortedImages: ProductImage[] = [...rawImages]
    .sort((a: any, b: any) => {
      const aPrimary = Boolean(a.is_primary);
      const bPrimary = Boolean(b.is_primary);
      if (aPrimary && !bPrimary) return -1;
      if (!aPrimary && bPrimary) return 1;
      return (Number(a.display_order) || 0) - (Number(b.display_order) || 0);
    })
    .map((img: any) => ({
      id: String(img.id),
      image_url: String(img.image_url || ""),
      alt_text: String(img.alt_text || row.name || "Desert Rose plant"),
      is_primary: Boolean(img.is_primary),
      display_order: Number(img.display_order ?? 0),
    }));

  const categoryName = Array.isArray(row.categories)
    ? row.categories[0]?.name
    : row.categories?.name || row.category_name || undefined;

  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    sku: String(row.sku),
    category_id: String(row.category_id || ""),
    category_name: categoryName,
    species: String(row.species || "Adenium Obesum"),
    variety: String(row.variety || ""),
    flower_color: String(row.flower_color || ""),
    petal_type: String(row.petal_type || ""),
    price: Number(row.price || 0),
    sale_price:
      row.sale_price !== null && row.sale_price !== undefined
        ? Number(row.sale_price)
        : null,
    stock_quantity: Number(row.stock_quantity ?? 0),
    low_stock_threshold: Number(row.low_stock_threshold ?? 2),
    caudex_size: String(row.caudex_size || ""),
    plant_age: String(row.plant_age || ""),
    is_grafted: Boolean(row.is_grafted),
    pot_size: String(row.pot_size || ""),
    description: String(row.description || ""),
    care_watering: String(row.care_watering || ""),
    care_sunlight: String(row.care_sunlight || ""),
    care_temperature: String(row.care_temperature || ""),
    care_soil: String(row.care_soil || ""),
    seasonal_notes: row.seasonal_notes ? String(row.seasonal_notes) : undefined,
    is_featured: Boolean(row.is_featured),
    is_published: Boolean(row.is_published),
    seo_title: row.seo_title ? String(row.seo_title) : undefined,
    seo_description: row.seo_description ? String(row.seo_description) : undefined,
    images:
      sortedImages.length > 0
        ? sortedImages
        : [
            {
              id: "img-fallback-" + row.id,
              image_url:
                "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
              alt_text: String(row.name),
              is_primary: true,
              display_order: 1,
            },
          ],
    created_at: String(row.created_at || new Date().toISOString()),
    updated_at: String(row.updated_at || new Date().toISOString()),
  };
}

function mapOrderItem(item: any): OrderItem {
  return {
    id: String(item.id),
    product_id: String(item.product_id || ""),
    product_name: String(item.product_name || "Desert Rose Plant"),
    product_sku: String(item.product_sku || ""),
    unit_price: Number(item.unit_price || 0),
    quantity: Number(item.quantity || 1),
    total_price: Number(item.total_price || 0),
    image_url: item.image_url ? String(item.image_url) : undefined,
  };
}

function mapOrder(order: any): Order {
  const rawItems = Array.isArray(order.items)
    ? order.items
    : Array.isArray(order.order_items)
    ? order.order_items
    : [];

  return {
    id: String(order.id),
    order_number: String(order.order_number),
    customer_name: String(order.customer_name || ""),
    customer_phone: String(order.customer_phone || ""),
    customer_whatsapp: String(order.customer_whatsapp || ""),
    customer_email: order.customer_email ? String(order.customer_email) : undefined,
    province: String(order.province || ""),
    city: String(order.city || ""),
    area: order.area ? String(order.area) : undefined,
    shipping_address: String(order.shipping_address || ""),
    order_notes: order.order_notes ? String(order.order_notes) : undefined,
    admin_notes: order.admin_notes ? String(order.admin_notes) : undefined,
    tracking_number: order.tracking_number ? String(order.tracking_number) : undefined,
    courier_name: order.courier_name ? String(order.courier_name) : undefined,
    subtotal: Number(order.subtotal || 0),
    shipping_fee: Number(order.shipping_fee || 0),
    discount: Number(order.discount || 0),
    total: Number(order.total || 0),
    payment_method: String(order.payment_method || "Cash on Delivery"),
    payment_status: (order.payment_status || "Pending") as PaymentStatus,
    order_status: (order.order_status || "Pending") as OrderStatus,
    items: rawItems.map(mapOrderItem),
    created_at: String(order.created_at || new Date().toISOString()),
    updated_at: String(order.updated_at || new Date().toISOString()),
  };
}

// ==========================================
// 1. PRODUCTS & INVENTORY
// ==========================================

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  species?: string;
  flowerColor?: string;
  petalType?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  search?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "name";
  limit?: number;
}): Promise<Product[]> {
  try {
    let query = supabase
      .from("products")
      .select("*, categories(name, slug), product_images(*)")
      .eq("is_published", true);

    if (options?.categoryId) {
      query = query.eq("category_id", options.categoryId);
    }

    if (options?.featuredOnly) {
      query = query.eq("is_featured", true);
    }

    if (options?.inStockOnly) {
      query = query.gt("stock_quantity", 0);
    }

    const { data, error } = await query;
    if (error) {
      console.error("getProducts query error:", error);
      return [];
    }

    let list = (data || []).map(mapProduct);

    // Filter by categorySlug if provided
    if (options?.categorySlug) {
      const slugLower = options.categorySlug.toLowerCase();
      list = list.filter((p) => {
        const item: any = (data || []).find((d: any) => d.id === p.id);
        const catSlug = Array.isArray(item?.categories)
          ? item?.categories[0]?.slug
          : item?.categories?.slug;
        return catSlug && catSlug.toLowerCase() === slugLower;
      });
    }

    // Filter by species
    if (options?.species) {
      const sp = options.species.toLowerCase();
      list = list.filter((p) => p.species.toLowerCase().includes(sp));
    }

    // Filter by flower color
    if (options?.flowerColor) {
      const fc = options.flowerColor.toLowerCase();
      list = list.filter((p) => p.flower_color.toLowerCase().includes(fc));
    }

    // Filter by petal type
    if (options?.petalType) {
      const pt = options.petalType.toLowerCase();
      list = list.filter((p) => p.petal_type.toLowerCase() === pt);
    }

    // Filter by price range
    if (typeof options?.minPrice === "number") {
      list = list.filter((p) => (p.sale_price ?? p.price) >= options.minPrice!);
    }
    if (typeof options?.maxPrice === "number") {
      list = list.filter((p) => (p.sale_price ?? p.price) <= options.maxPrice!);
    }

    // Keyword search
    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.variety.toLowerCase().includes(q) ||
          p.species.toLowerCase().includes(q) ||
          p.flower_color.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    const sort = options?.sort || "featured";
    if (sort === "price-asc") {
      list.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
    } else if (sort === "price-desc") {
      list.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
    } else if (sort === "newest") {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    if (options?.limit && options.limit > 0) {
      list = list.slice(0, options.limit);
    }

    return list;
  } catch (err) {
    console.error("getProducts unexpected error:", err);
    return [];
  }
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, categories(name, slug), product_images(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getAllProductsAdmin error:", error);
      return [];
    }

    return (data || []).map(mapProduct);
  } catch (err) {
    console.error("getAllProductsAdmin unexpected error:", err);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(name, slug), product_images(*)")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapProduct(data);
  } catch (err) {
    console.error("getProductBySlug error:", err);
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*, categories(name, slug), product_images(*)")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapProduct(data);
  } catch (err) {
    console.error("getProductById error:", err);
    return null;
  }
}

export async function saveProduct(
  product: Partial<Product> & { name: string; price: number }
): Promise<Product> {
  const now = new Date().toISOString();
  const id = product.id && isUuid(product.id) ? product.id : crypto.randomUUID();

  const slug =
    product.slug ||
    product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const sku = product.sku || `PAK-${Math.floor(100 + Math.random() * 900)}`;

  const productPayload: any = {
    id,
    name: product.name,
    slug,
    sku,
    category_id: product.category_id && isUuid(product.category_id) ? product.category_id : null,
    species: product.species || "Adenium Obesum",
    variety: product.variety || "Hybrid Variety",
    flower_color: product.flower_color || "Rose Pink",
    petal_type: product.petal_type || "Single",
    price: Number(product.price),
    sale_price:
      product.sale_price !== undefined
        ? product.sale_price === null || product.sale_price === 0 || product.sale_price === ("" as any)
          ? null
          : Number(product.sale_price)
        : null,
    stock_quantity: typeof product.stock_quantity === "number" ? Math.max(0, product.stock_quantity) : 5,
    low_stock_threshold:
      typeof product.low_stock_threshold === "number" ? Math.max(0, product.low_stock_threshold) : 2,
    caudex_size: product.caudex_size || "Medium (15cm circumference)",
    plant_age: product.plant_age || "2 Years",
    is_grafted: product.is_grafted ?? true,
    pot_size: product.pot_size || "8-inch Nursery Pot",
    description: product.description || "Desert Rose plant nurtured at Pak Adenium Nursery.",
    care_watering: product.care_watering || "Water when topsoil is completely dry.",
    care_sunlight: product.care_sunlight || "Full direct sun 6+ hours daily.",
    care_temperature: product.care_temperature || "25°C to 45°C. Protect from heavy winter frost.",
    care_soil: product.care_soil || "Fast-draining mineral potting media.",
    seasonal_notes: product.seasonal_notes || null,
    is_featured: product.is_featured ?? false,
    is_published: product.is_published ?? true,
    seo_title: product.seo_title || `${product.name} | Pak Adenium Nursery`,
    seo_description: product.seo_description || `Order authentic ${product.name} online in Pakistan.`,
    updated_at: now,
  };

  const { error: upsertErr } = await supabaseAdmin
    .from("products")
    .upsert(productPayload);

  if (upsertErr) {
    console.error("saveProduct upsert error:", upsertErr);
    throw new Error(`Failed to save product: ${upsertErr.message}`);
  }

  // Cleanly sync product_images
  if (Array.isArray(product.images) && product.images.length > 0) {
    // Delete existing images for this product
    await supabaseAdmin.from("product_images").delete().eq("product_id", id);

    const imagesToInsert = product.images.map((img, idx) => ({
      id: img.id && isUuid(img.id) ? img.id : crypto.randomUUID(),
      product_id: id,
      image_url: img.image_url,
      alt_text: img.alt_text || product.name,
      is_primary: idx === 0 ? (img.is_primary ?? true) : Boolean(img.is_primary),
      display_order: Number(img.display_order ?? idx + 1),
      created_at: now,
    }));

    const { error: imgErr } = await supabaseAdmin.from("product_images").insert(imagesToInsert);
    if (imgErr) {
      console.warn("Failed to insert synced product images:", imgErr);
    }
  }

  const saved = await getProductById(id);
  if (!saved) {
    return mapProduct({ ...productPayload, product_images: product.images || [] });
  }

  return saved;
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) {
      console.error("deleteProduct error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteProduct unexpected error:", err);
    return false;
  }
}

export async function adjustInventory(
  productId: string,
  quantity: number,
  lowStockThreshold?: number,
  isPublished?: boolean
): Promise<Product | null> {
  try {
    const { data: existing, error: fetchErr } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (fetchErr || !existing) {
      console.error("adjustInventory product not found:", fetchErr);
      return null;
    }

    const previousQuantity = Number(existing.stock_quantity ?? 0);
    const newQuantity = Math.max(0, quantity);
    const changeAmount = newQuantity - previousQuantity;
    const now = new Date().toISOString();

    const updatePayload: any = {
      stock_quantity: newQuantity,
      updated_at: now,
    };

    if (typeof lowStockThreshold === "number") {
      updatePayload.low_stock_threshold = Math.max(0, lowStockThreshold);
    }

    if (typeof isPublished === "boolean") {
      updatePayload.is_published = isPublished;
    }

    const { error: updateErr } = await supabaseAdmin
      .from("products")
      .update(updatePayload)
      .eq("id", productId);

    if (updateErr) {
      console.error("adjustInventory update error:", updateErr);
      return null;
    }

    // Insert audit row into inventory_logs
    const { error: logErr } = await supabaseAdmin.from("inventory_logs").insert({
      id: crypto.randomUUID(),
      product_id: productId,
      change_amount: changeAmount,
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
      reason: "Manual Adjustment",
      reference_id: "admin-inventory-update",
      created_at: now,
    });

    if (logErr) {
      console.warn("Failed to write inventory audit log:", logErr);
    }

    return await getProductById(productId);
  } catch (err) {
    console.error("adjustInventory unexpected error:", err);
    return null;
  }
}

// ==========================================
// 2. CATEGORIES
// ==========================================

export async function getCategories(): Promise<Category[]> {
  try {
    const [catRes, prodRes] = await Promise.all([
      supabase.from("categories").select("*").order("display_order", { ascending: true }),
      supabase.from("products").select("category_id").eq("is_published", true),
    ]);

    if (catRes.error) {
      console.error("getCategories error:", catRes.error);
      return [];
    }

    const products = prodRes.data || [];
    const countMap = new Map<string, number>();
    for (const p of products) {
      if (p.category_id) {
        countMap.set(p.category_id, (countMap.get(p.category_id) || 0) + 1);
      }
    }

    return (catRes.data || []).map((cat) => ({
      id: String(cat.id),
      name: String(cat.name),
      slug: String(cat.slug),
      description: String(cat.description || ""),
      image_url: String(cat.image_url || ""),
      display_order: Number(cat.display_order ?? 0),
      is_active: Boolean(cat.is_active),
      product_count: countMap.get(cat.id) || 0,
      created_at: cat.created_at,
    }));
  } catch (err) {
    console.error("getCategories unexpected error:", err);
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const { data: cat, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !cat) return null;

    const { count } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", cat.id)
      .eq("is_published", true);

    return {
      id: String(cat.id),
      name: String(cat.name),
      slug: String(cat.slug),
      description: String(cat.description || ""),
      image_url: String(cat.image_url || ""),
      display_order: Number(cat.display_order ?? 0),
      is_active: Boolean(cat.is_active),
      product_count: count ?? 0,
      created_at: cat.created_at,
    };
  } catch (err) {
    console.error("getCategoryBySlug error:", err);
    return null;
  }
}

export async function saveCategory(
  category: Partial<Category> & { name: string }
): Promise<Category> {
  const id = category.id && isUuid(category.id) ? category.id : crypto.randomUUID();
  const slug =
    category.slug ||
    category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const payload: any = {
    id,
    name: category.name,
    slug,
    description: category.description || "",
    image_url:
      category.image_url ||
      "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
    display_order: Number(category.display_order ?? 1),
    is_active: category.is_active ?? true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin.from("categories").upsert(payload);
  if (error) {
    console.error("saveCategory error:", error);
    throw new Error(`Failed to save category: ${error.message}`);
  }

  return {
    ...payload,
    product_count: category.product_count ?? 0,
  };
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
    if (error) {
      console.error("deleteCategory error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteCategory error:", err);
    return false;
  }
}

// ==========================================
// 3. ORDERS & CHECKOUT
// ==========================================

export interface PlaceOrderPayload {
  customer_name: string;
  customer_phone: string;
  customer_whatsapp: string;
  customer_email?: string;
  province: string;
  city: string;
  area?: string;
  shipping_address: string;
  order_notes?: string;
  payment_method: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export async function getOrders(status?: string): Promise<Order[]> {
  try {
    let query = supabaseAdmin
      .from("orders")
      .select("*, items:order_items(*)")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.ilike("order_status", status);
    }

    const { data, error } = await query;
    if (error) {
      console.error("getOrders error:", error);
      return [];
    }

    return (data || []).map(mapOrder);
  } catch (err) {
    console.error("getOrders unexpected error:", err);
    return [];
  }
}

export async function getOrderByIdOrNumber(idOrNumber: string): Promise<Order | null> {
  try {
    const trimmed = idOrNumber.trim();

    if (isUuid(trimmed)) {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*, items:order_items(*)")
        .eq("id", trimmed)
        .maybeSingle();

      if (!error && data) {
        return mapOrder(data);
      }
    }

    // Lookup by order_number (e.g. PAK-2601)
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*, items:order_items(*)")
      .ilike("order_number", trimmed)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return mapOrder(data);
  } catch (err) {
    console.error("getOrderByIdOrNumber error:", err);
    return null;
  }
}

export async function createOrder(
  payload: PlaceOrderPayload
): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    if (!payload.items || payload.items.length === 0) {
      return { success: false, error: "Your shopping bag is empty." };
    }

    // Call atomic Postgres function via Supabase RPC
    const { data, error } = await supabaseAdmin.rpc("create_order_atomic", {
      p_order_payload: {
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        customer_whatsapp: payload.customer_whatsapp,
        customer_email: payload.customer_email || null,
        province: payload.province,
        city: payload.city,
        area: payload.area || null,
        shipping_address: payload.shipping_address,
        order_notes: payload.order_notes || null,
        payment_method: payload.payment_method,
      },
      p_order_items: payload.items.map((it) => ({
        product_id: it.product_id,
        quantity: it.quantity,
      })),
    });

    if (error) {
      console.error("createOrder RPC error:", error);
      return { success: false, error: error.message || "Failed to create order" };
    }

    const orderId = data?.order_id;
    if (!orderId) {
      return { success: false, error: "No order returned by transaction" };
    }

    const createdOrder = await getOrderByIdOrNumber(orderId);
    if (!createdOrder) {
      return { success: false, error: "Failed to load newly placed order" };
    }

    return { success: true, order: createdOrder };
  } catch (err: any) {
    console.error("createOrder unexpected error:", err);
    return { success: false, error: err?.message || "An unexpected error occurred while placing your order" };
  }
}

export async function updateOrderStatus(
  orderId: string,
  orderStatus: OrderStatus,
  paymentStatus?: PaymentStatus,
  adminNotes?: string,
  trackingNumber?: string,
  courierName?: string
): Promise<Order | null> {
  try {
    const updatePayload: any = {
      order_status: orderStatus,
      updated_at: new Date().toISOString(),
    };

    if (paymentStatus) {
      updatePayload.payment_status = paymentStatus;
    }
    if (typeof adminNotes === "string") {
      updatePayload.admin_notes = adminNotes;
    }
    if (typeof trackingNumber === "string") {
      updatePayload.tracking_number = trackingNumber;
    }
    if (typeof courierName === "string") {
      updatePayload.courier_name = courierName;
    }

    const { error } = await supabaseAdmin
      .from("orders")
      .update(updatePayload)
      .eq("id", orderId);

    if (error) {
      console.error("updateOrderStatus error:", error);
      return null;
    }

    return await getOrderByIdOrNumber(orderId);
  } catch (err) {
    console.error("updateOrderStatus unexpected error:", err);
    return null;
  }
}

// ==========================================
// 4. ARTICLES / JOURNAL
// ==========================================

export async function getArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getArticles error:", error);
      return [];
    }

    return (data || []).map((a) => ({
      id: String(a.id),
      title: String(a.title),
      slug: String(a.slug),
      category: String(a.category || "General Care"),
      excerpt: String(a.excerpt || ""),
      content: String(a.content || ""),
      featured_image: String(a.featured_image || ""),
      author_name: String(a.author_name || "Pak Adenium Master Horticulturist"),
      read_time_minutes: Number(a.read_time_minutes || 5),
      is_published: Boolean(a.is_published),
      seo_title: a.seo_title ? String(a.seo_title) : undefined,
      seo_description: a.seo_description ? String(a.seo_description) : undefined,
      created_at: String(a.created_at),
      updated_at: String(a.updated_at),
    }));
  } catch (err) {
    console.error("getArticles error:", err);
    return [];
  }
}

export async function getAllArticlesAdmin(): Promise<Article[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getAllArticlesAdmin error:", error);
      return [];
    }

    return (data || []).map((a) => ({
      id: String(a.id),
      title: String(a.title),
      slug: String(a.slug),
      category: String(a.category || "General Care"),
      excerpt: String(a.excerpt || ""),
      content: String(a.content || ""),
      featured_image: String(a.featured_image || ""),
      author_name: String(a.author_name || "Pak Adenium Master Horticulturist"),
      read_time_minutes: Number(a.read_time_minutes || 5),
      is_published: Boolean(a.is_published),
      seo_title: a.seo_title ? String(a.seo_title) : undefined,
      seo_description: a.seo_description ? String(a.seo_description) : undefined,
      created_at: String(a.created_at),
      updated_at: String(a.updated_at),
    }));
  } catch (err) {
    console.error("getAllArticlesAdmin error:", err);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: String(data.id),
      title: String(data.title),
      slug: String(data.slug),
      category: String(data.category || "General Care"),
      excerpt: String(data.excerpt || ""),
      content: String(data.content || ""),
      featured_image: String(data.featured_image || ""),
      author_name: String(data.author_name || "Pak Adenium Master Horticulturist"),
      read_time_minutes: Number(data.read_time_minutes || 5),
      is_published: Boolean(data.is_published),
      seo_title: data.seo_title ? String(data.seo_title) : undefined,
      seo_description: data.seo_description ? String(data.seo_description) : undefined,
      created_at: String(data.created_at),
      updated_at: String(data.updated_at),
    };
  } catch (err) {
    console.error("getArticleBySlug error:", err);
    return null;
  }
}

export async function saveArticle(
  article: Partial<Article> & { title: string; content: string }
): Promise<Article> {
  const id = article.id && isUuid(article.id) ? article.id : crypto.randomUUID();
  const slug =
    article.slug ||
    article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const now = new Date().toISOString();
  const payload: any = {
    id,
    title: article.title,
    slug,
    category: article.category || "General Care",
    excerpt: article.excerpt || article.content.substring(0, 160) + "...",
    content: article.content,
    featured_image:
      article.featured_image ||
      "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
    author_name: article.author_name || "Pak Adenium Master Horticulturist",
    read_time_minutes: Number(article.read_time_minutes || 5),
    is_published: article.is_published ?? true,
    seo_title: article.seo_title || `${article.title} | Pak Adenium Journal`,
    seo_description: article.seo_description || article.excerpt,
    updated_at: now,
  };

  const { error } = await supabaseAdmin.from("articles").upsert(payload);
  if (error) {
    console.error("saveArticle error:", error);
    throw new Error(`Failed to save article: ${error.message}`);
  }

  return {
    ...payload,
    created_at: article.created_at || now,
  };
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from("articles").delete().eq("id", id);
    if (error) {
      console.error("deleteArticle error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("deleteArticle unexpected error:", err);
    return false;
  }
}

// ==========================================
// 5. SITE SETTINGS
// ==========================================

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase.from("site_settings").select("key, value");

    const settings: SiteSettings = {
      ...initialSiteSettings,
      general: { ...initialSiteSettings.general },
      shipping: { ...initialSiteSettings.shipping },
      payment_methods: { ...initialSiteSettings.payment_methods },
      announcement: { ...initialSiteSettings.announcement },
      homepage: { ...initialSiteSettings.homepage },
      seo: { ...initialSiteSettings.seo },
      social: { ...initialSiteSettings.social },
    };

    if (error) {
      console.warn("getSiteSettings query warning, using initial fallback:", error.message);
      return settings;
    }

    for (const row of data || []) {
      const key = row.key as keyof SiteSettings;
      if (key in settings && row.value && typeof row.value === "object") {
        (settings as any)[key] = {
          ...(settings as any)[key],
          ...row.value,
        };
      }
    }

    return settings;
  } catch (err) {
    console.error("getSiteSettings unexpected error:", err);
    return initialSiteSettings;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  try {
    const now = new Date().toISOString();
    const entries = Object.entries(settings);

    for (const [key, val] of entries) {
      if (val !== undefined && val !== null) {
        const { error } = await supabaseAdmin
          .from("site_settings")
          .upsert(
            { key, value: val, updated_at: now },
            { onConflict: "key" }
          );

        if (error) {
          console.warn(`Failed to update site_settings key "${key}":`, error.message);
        }
      }
    }

    return await getSiteSettings();
  } catch (err) {
    console.error("updateSiteSettings unexpected error:", err);
    return await getSiteSettings();
  }
}

// ==========================================
// 6. CUSTOMERS & DASHBOARD METRICS
// ==========================================

export async function getCustomers(): Promise<Customer[]> {
  try {
    const orders = await getOrders();
    const map = new Map<string, Customer>();

    for (const order of orders) {
      const rawKey = (order.customer_phone || order.customer_whatsapp || order.customer_name)
        .trim()
        .toLowerCase();
      const key = rawKey.replace(/[^a-z0-9]/g, "");
      if (!key) continue;

      const existing = map.get(key);
      if (existing) {
        existing.total_orders += 1;
        existing.total_spend += order.total;
        if (new Date(order.created_at).getTime() > new Date(existing.last_order_date).getTime()) {
          existing.last_order_date = order.created_at;
          existing.last_order_number = order.order_number;
          if (order.city) existing.city = order.city;
          if (order.province) existing.province = order.province;
          if (order.customer_email) existing.email = order.customer_email;
        }
      } else {
        map.set(key, {
          id: "cust-" + Math.abs(key.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)).toString(36),
          name: order.customer_name,
          phone: order.customer_phone,
          whatsapp: order.customer_whatsapp || order.customer_phone,
          email: order.customer_email || undefined,
          city: order.city,
          province: order.province,
          total_orders: 1,
          total_spend: order.total,
          last_order_date: order.created_at,
          last_order_number: order.order_number,
        });
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.last_order_date).getTime() - new Date(a.last_order_date).getTime()
    );
  } catch (err) {
    console.error("getCustomers error:", err);
    return [];
  }
}

export async function getDashboardMetrics() {
  try {
    const [orders, products, customers] = await Promise.all([
      getOrders(),
      getAllProductsAdmin(),
      getCustomers(),
    ]);

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.order_status === "Pending").length;
    const completedOrders = orders.filter((o) => o.order_status === "Delivered").length;
    const cancelledOrders = orders.filter((o) => o.order_status === "Cancelled").length;
    const totalSales = orders
      .filter((o) => o.order_status !== "Cancelled")
      .reduce((acc, curr) => acc + curr.total, 0);

    const activeProducts = products.filter((p) => p.is_published).length;
    const lowStockProducts = products.filter(
      (p) => p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0
    );
    const outOfStockProducts = products.filter((p) => p.stock_quantity === 0);
    const recentOrders = orders.slice(0, 6);

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      lowStockProducts,
      outOfStockProducts,
      recentOrders,
      totalProducts: products.length,
      activeProducts,
      totalCustomers: customers.length,
    };
  } catch (err) {
    console.error("getDashboardMetrics error:", err);
    return {
      totalSales: 0,
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      lowStockProducts: [],
      outOfStockProducts: [],
      recentOrders: [],
      totalProducts: 0,
      activeProducts: 0,
      totalCustomers: 0,
    };
  }
}

// ==========================================
// 7. REVIEWS & INQUIRIES
// ==========================================

export async function getApprovedReviews(productId?: string): Promise<PlantReview[]> {
  try {
    let query = supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });

    if (productId) {
      query = query.eq("product_id", productId);
    }

    const { data, error } = await query;
    if (error) {
      console.error("getApprovedReviews error:", error);
      return [];
    }

    return (data || []).map((r) => ({
      id: String(r.id),
      product_id: String(r.product_id),
      customer_name: String(r.customer_name),
      rating: Number(r.rating),
      comment: String(r.comment),
      verified_purchase: Boolean(r.verified_purchase),
      is_approved: Boolean(r.is_approved),
      created_at: String(r.created_at),
    }));
  } catch (err) {
    console.error("getApprovedReviews unexpected error:", err);
    return [];
  }
}

export async function submitReview(payload: {
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  verified_purchase?: boolean;
}): Promise<PlantReview> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const insertData = {
    id,
    product_id: payload.product_id,
    customer_name: payload.customer_name,
    rating: Math.max(1, Math.min(5, Math.round(payload.rating))),
    comment: payload.comment,
    verified_purchase: payload.verified_purchase ?? false,
    is_approved: false, // Default moderation state
    created_at: now,
  };

  const { error } = await supabase.from("reviews").insert(insertData);
  if (error) {
    console.error("submitReview error:", error);
    throw new Error(`Failed to submit review: ${error.message}`);
  }

  return insertData;
}

export async function getInquiries(): Promise<ContactInquiry[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getInquiries error:", error);
      return [];
    }

    return (data || []).map((inq) => ({
      id: String(inq.id),
      name: String(inq.name),
      phone: String(inq.phone),
      email: inq.email ? String(inq.email) : undefined,
      subject: inq.subject ? String(inq.subject) : undefined,
      message: String(inq.message),
      status: (inq.status || "New") as "New" | "Responded" | "Archived",
      created_at: String(inq.created_at),
    }));
  } catch (err) {
    console.error("getInquiries unexpected error:", err);
    return [];
  }
}

export async function submitInquiry(payload: {
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  message: string;
}): Promise<ContactInquiry> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const insertData = {
    id,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email?.trim() || null,
    subject: payload.subject?.trim() || null,
    message: payload.message.trim(),
    status: "New",
    created_at: now,
  };

  const { error } = await supabase.from("inquiries").insert(insertData);
  if (error) {
    console.error("submitInquiry error:", error);
    throw new Error(`Failed to submit inquiry: ${error.message}`);
  }

  return {
    id: insertData.id,
    name: insertData.name,
    phone: insertData.phone,
    email: insertData.email || undefined,
    subject: insertData.subject || undefined,
    message: insertData.message,
    status: "New",
    created_at: insertData.created_at,
  };
}
