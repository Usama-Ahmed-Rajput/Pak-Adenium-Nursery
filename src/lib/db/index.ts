import fs from "fs";
import path from "path";
import {
  Product,
  Category,
  Order,
  Article,
  SiteSettings,
  PlantReview,
  ContactInquiry,
  OrderStatus,
  PaymentStatus,
  Customer,
} from "@/types";
import {
  initialCategories,
  initialProducts,
  initialArticles,
  initialReviews,
  initialSiteSettings,
} from "./initialData";

interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  orders: Order[];
  articles: Article[];
  siteSettings: SiteSettings;
  reviews: PlantReview[];
  inquiries: ContactInquiry[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "database.json");

function ensureDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const defaultDb: DatabaseSchema = {
        categories: initialCategories,
        products: initialProducts,
        orders: [
          {
            id: "ord-demo-001",
            order_number: "PAK-2601",
            customer_name: "Haris Qureshi",
            customer_phone: "03009876543",
            customer_whatsapp: "923009876543",
            customer_email: "haris.q@example.pk",
            province: "Punjab",
            city: "Lahore",
            area: "DHA Phase 6",
            shipping_address: "House 42, Sector C, Street 8, DHA Phase 6",
            order_notes: "Please deliver on Saturday if possible.",
            admin_notes: "Customer confirmed via WhatsApp call.",
            subtotal: 9500,
            shipping_fee: 0,
            discount: 0,
            total: 9500,
            payment_method: "Bank Transfer",
            payment_status: "Verified",
            order_status: "Confirmed",
            items: [
              {
                id: "item-1",
                product_id: "prod-dorset-horn",
                product_name: "Dorset Horn Adenium 'Khao Hin Khon'",
                product_sku: "PAK-DH-001",
                unit_price: 9500,
                quantity: 1,
                total_price: 9500,
                image_url:
                  "https://images.unsplash.com/photo-1512428813834-c702c7702b78?q=80&w=1200&auto=format&fit=crop",
              },
            ],
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            updated_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          },
        ],
        articles: initialArticles,
        siteSettings: initialSiteSettings,
        reviews: initialReviews,
        inquiries: [],
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf-8");
      return defaultDb;
    }

    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    parsed.siteSettings = {
      ...initialSiteSettings,
      ...parsed.siteSettings,
      general: { ...initialSiteSettings.general, ...parsed.siteSettings?.general },
      shipping: { ...initialSiteSettings.shipping, ...parsed.siteSettings?.shipping },
      payment_methods: { ...initialSiteSettings.payment_methods, ...parsed.siteSettings?.payment_methods },
      announcement: { ...initialSiteSettings.announcement, ...parsed.siteSettings?.announcement },
      homepage: { ...initialSiteSettings.homepage, ...parsed.siteSettings?.homepage },
      seo: { ...initialSiteSettings.seo, ...parsed.siteSettings?.seo },
      social: { ...initialSiteSettings.social, ...parsed.siteSettings?.social },
    };
    return parsed;
  } catch (error) {
    console.error("Database read error, falling back to defaults", error);
    return {
      categories: initialCategories,
      products: initialProducts,
      orders: [],
      articles: initialArticles,
      siteSettings: initialSiteSettings,
      reviews: initialReviews,
      inquiries: [],
    };
  }
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Database save error", error);
  }
}

// ==========================================
// PRODUCTS SERVICE
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
  const db = ensureDatabase();
  let list = db.products.filter((p) => p.is_published);

  if (options?.categorySlug) {
    const cat = db.categories.find((c) => c.slug === options.categorySlug);
    if (cat) {
      list = list.filter((p) => p.category_id === cat.id);
    }
  } else if (options?.categoryId) {
    list = list.filter((p) => p.category_id === options.categoryId);
  }

  if (options?.species) {
    list = list.filter((p) => p.species.toLowerCase().includes(options.species!.toLowerCase()));
  }

  if (options?.flowerColor) {
    list = list.filter((p) => p.flower_color.toLowerCase().includes(options.flowerColor!.toLowerCase()));
  }

  if (options?.petalType) {
    list = list.filter((p) => p.petal_type.toLowerCase() === options.petalType!.toLowerCase());
  }

  if (typeof options?.minPrice === "number") {
    list = list.filter((p) => (p.sale_price ?? p.price) >= options.minPrice!);
  }

  if (typeof options?.maxPrice === "number") {
    list = list.filter((p) => (p.sale_price ?? p.price) <= options.maxPrice!);
  }

  if (options?.inStockOnly) {
    list = list.filter((p) => p.stock_quantity > 0);
  }

  if (options?.featuredOnly) {
    list = list.filter((p) => p.is_featured);
  }

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
    // Featured first
    list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  }

  if (options?.limit && options.limit > 0) {
    list = list.slice(0, options.limit);
  }

  return list;
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const db = ensureDatabase();
  return db.products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = ensureDatabase();
  const product = db.products.find((p) => p.slug === slug);
  return product || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = ensureDatabase();
  const product = db.products.find((p) => p.id === id);
  return product || null;
}

export async function saveProduct(product: Partial<Product> & { name: string; price: number }): Promise<Product> {
  const db = ensureDatabase();
  const now = new Date().toISOString();

  if (product.id) {
    const index = db.products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      const existing = db.products[index];
      const categoryId = product.category_id || existing.category_id;
      const categoryName = db.categories.find((c) => c.id === categoryId)?.name || existing.category_name;

      const updated: Product = {
        ...existing,
        ...product,
        category_id: categoryId,
        category_name: categoryName,
        price: Number(product.price ?? existing.price),
        sale_price:
          product.sale_price !== undefined
            ? product.sale_price === null || product.sale_price === 0 || product.sale_price === ("" as unknown as number)
              ? null
              : Number(product.sale_price)
            : existing.sale_price,
        stock_quantity:
          typeof product.stock_quantity === "number"
            ? Math.max(0, product.stock_quantity)
            : existing.stock_quantity,
        low_stock_threshold:
          typeof product.low_stock_threshold === "number"
            ? Math.max(0, product.low_stock_threshold)
            : existing.low_stock_threshold,
        is_published: typeof product.is_published === "boolean" ? product.is_published : existing.is_published,
        is_featured: typeof product.is_featured === "boolean" ? product.is_featured : existing.is_featured,
        images: Array.isArray(product.images) && product.images.length > 0 ? product.images : existing.images,
        updated_at: now,
      };
      db.products[index] = updated;
      saveDatabase(db);
      return updated;
    }
  }

  // Create new
  const slug =
    product.slug ||
    product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const categoryId = product.category_id || (db.categories[0]?.id ?? "cat-grafted");
  const categoryName = db.categories.find((c) => c.id === categoryId)?.name || "Grafted Varieties";

  const newProduct: Product = {
    id: "prod-" + Math.random().toString(36).substring(2, 9),
    name: product.name,
    slug,
    sku: product.sku || `PAK-${Math.floor(100 + Math.random() * 900)}`,
    category_id: categoryId,
    category_name: categoryName,
    species: product.species || "Adenium Obesum",
    variety: product.variety || "Hybrid Specimen",
    flower_color: product.flower_color || "Rose Pink",
    petal_type: product.petal_type || "Single",
    price: Number(product.price),
    sale_price: product.sale_price ? Number(product.sale_price) : null,
    stock_quantity: typeof product.stock_quantity === "number" ? Math.max(0, product.stock_quantity) : 5,
    low_stock_threshold: typeof product.low_stock_threshold === "number" ? Math.max(0, product.low_stock_threshold) : 2,
    caudex_size: product.caudex_size || "Medium (15cm circumference)",
    plant_age: product.plant_age || "2 Years",
    is_grafted: product.is_grafted ?? true,
    pot_size: product.pot_size || "8-inch Nursery Pot",
    description: product.description || "Botanical specimen nurtured at Pak Adenium Nursery.",
    care_watering: product.care_watering || "Water when topsoil is completely dry.",
    care_sunlight: product.care_sunlight || "Full direct sun 6+ hours daily.",
    care_temperature: product.care_temperature || "25°C to 45°C. Protect from heavy winter frost.",
    care_soil: product.care_soil || "Fast-draining mineral potting media.",
    seasonal_notes: product.seasonal_notes || "Flushes spring through autumn.",
    is_featured: product.is_featured ?? false,
    is_published: product.is_published ?? true,
    seo_title: product.seo_title || `${product.name} | Pak Adenium Nursery`,
    seo_description: product.seo_description || `Order authentic ${product.name} online in Pakistan.`,
    images:
      product.images && product.images.length > 0
        ? product.images
        : [
            {
              id: "img-" + Math.random().toString(36).substring(2, 7),
              image_url:
                "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
              alt_text: product.name,
              is_primary: true,
              display_order: 1,
            },
          ],
    created_at: now,
    updated_at: now,
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const db = ensureDatabase();
  const initialLen = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

export async function adjustInventory(
  productId: string,
  quantity: number,
  lowStockThreshold?: number,
  isPublished?: boolean
): Promise<Product | null> {
  const db = ensureDatabase();
  const product = db.products.find((p) => p.id === productId);
  if (!product) return null;

  product.stock_quantity = Math.max(0, quantity);
  if (typeof lowStockThreshold === "number") {
    product.low_stock_threshold = Math.max(0, lowStockThreshold);
  }
  if (typeof isPublished === "boolean") {
    product.is_published = isPublished;
  }
  product.updated_at = new Date().toISOString();
  saveDatabase(db);
  return product;
}

// ==========================================
// CATEGORIES SERVICE
// ==========================================
export async function getCategories(): Promise<Category[]> {
  const db = ensureDatabase();
  return db.categories.map((c) => ({
    ...c,
    product_count: db.products.filter((p) => p.category_id === c.id && p.is_published).length,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const db = ensureDatabase();
  const cat = db.categories.find((c) => c.slug === slug);
  if (!cat) return null;
  return {
    ...cat,
    product_count: db.products.filter((p) => p.category_id === cat.id && p.is_published).length,
  };
}

export async function saveCategory(category: Partial<Category> & { name: string }): Promise<Category> {
  const db = ensureDatabase();
  const slug =
    category.slug ||
    category.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  if (category.id) {
    const idx = db.categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      const updated: Category = {
        ...db.categories[idx],
        ...category,
        slug,
      };
      db.categories[idx] = updated;
      saveDatabase(db);
      return updated;
    }
  }

  const newCat: Category = {
    id: "cat-" + Math.random().toString(36).substring(2, 9),
    name: category.name,
    slug,
    description: category.description || "",
    image_url:
      category.image_url ||
      "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
    display_order: category.display_order ?? db.categories.length + 1,
    is_active: category.is_active ?? true,
  };

  db.categories.push(newCat);
  saveDatabase(db);
  return newCat;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const db = ensureDatabase();
  const initialLen = db.categories.length;
  db.categories = db.categories.filter((c) => c.id !== id);
  if (db.categories.length !== initialLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ==========================================
// ORDERS SERVICE (Server-side price verification & stock reduction)
// ==========================================
export async function getOrders(status?: string): Promise<Order[]> {
  const db = ensureDatabase();
  let orders = db.orders;
  if (status && status !== "all") {
    orders = orders.filter((o) => o.order_status.toLowerCase() === status.toLowerCase());
  }
  return orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getOrderByIdOrNumber(idOrNumber: string): Promise<Order | null> {
  const db = ensureDatabase();
  const order = db.orders.find(
    (o) => o.id === idOrNumber || o.order_number.toLowerCase() === idOrNumber.toLowerCase()
  );
  return order || null;
}

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

export async function createOrder(payload: PlaceOrderPayload): Promise<{ success: boolean; order?: Order; error?: string }> {
  const db = ensureDatabase();

  if (!payload.items || payload.items.length === 0) {
    return { success: false, error: "Your shopping bag is empty." };
  }

  // Calculate prices safely on the server and check stock
  let subtotal = 0;
  const verifiedOrderItems: Order["items"] = [];

  for (const item of payload.items) {
    const product = db.products.find((p) => p.id === item.product_id);
    if (!product) {
      return { success: false, error: `Product not found: ${item.product_id}` };
    }
    if (product.stock_quantity < item.quantity) {
      return {
        success: false,
        error: `Insufficient stock for "${product.name}". Available: ${product.stock_quantity}`,
      };
    }

    const actualUnitPrice = product.sale_price ?? product.price;
    const itemTotal = actualUnitPrice * item.quantity;
    subtotal += itemTotal;

    verifiedOrderItems.push({
      id: "item-" + Math.random().toString(36).substring(2, 9),
      product_id: product.id,
      product_name: product.name,
      product_sku: product.sku,
      unit_price: actualUnitPrice,
      quantity: item.quantity,
      total_price: itemTotal,
      image_url: product.images[0]?.image_url,
    });
  }

  // Calculate shipping based on settings
  const settings = db.siteSettings.shipping;
  const shippingFee =
    subtotal >= settings.free_shipping_threshold ? 0 : settings.default_shipping_fee;
  const discount = 0;
  const total = subtotal + shippingFee - discount;

  // Generate order number e.g. PAK-2602
  const orderNum = `PAK-${Math.floor(2600 + db.orders.length + Math.random() * 50)}`;

  const now = new Date().toISOString();
  const newOrder: Order = {
    id: "ord-" + Math.random().toString(36).substring(2, 10),
    order_number: orderNum,
    customer_name: payload.customer_name,
    customer_phone: payload.customer_phone,
    customer_whatsapp: payload.customer_whatsapp,
    customer_email: payload.customer_email || "",
    province: payload.province,
    city: payload.city,
    area: payload.area || "",
    shipping_address: payload.shipping_address,
    order_notes: payload.order_notes || "",
    admin_notes: "",
    subtotal,
    shipping_fee: shippingFee,
    discount,
    total,
    payment_method: payload.payment_method,
    payment_status: "Pending",
    order_status: "Pending",
    items: verifiedOrderItems,
    created_at: now,
    updated_at: now,
  };

  // Deduct inventory
  for (const item of payload.items) {
    const p = db.products.find((prod) => prod.id === item.product_id);
    if (p) {
      p.stock_quantity = Math.max(0, p.stock_quantity - item.quantity);
      p.updated_at = now;
    }
  }

  db.orders.unshift(newOrder);
  saveDatabase(db);

  return { success: true, order: newOrder };
}

export async function updateOrderStatus(
  orderId: string,
  orderStatus: OrderStatus,
  paymentStatus?: PaymentStatus,
  adminNotes?: string,
  trackingNumber?: string,
  courierName?: string
): Promise<Order | null> {
  const db = ensureDatabase();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.order_status = orderStatus;
  if (paymentStatus) {
    order.payment_status = paymentStatus;
  }
  if (typeof adminNotes === "string") {
    order.admin_notes = adminNotes;
  }
  if (typeof trackingNumber === "string") {
    order.tracking_number = trackingNumber;
  }
  if (typeof courierName === "string") {
    order.courier_name = courierName;
  }
  order.updated_at = new Date().toISOString();

  saveDatabase(db);
  return order;
}

// ==========================================
// ARTICLES / PLANT CARE JOURNAL
// ==========================================
export async function getArticles(): Promise<Article[]> {
  const db = ensureDatabase();
  return db.articles.filter((a) => a.is_published);
}

export async function getAllArticlesAdmin(): Promise<Article[]> {
  const db = ensureDatabase();
  return db.articles;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const db = ensureDatabase();
  const article = db.articles.find((a) => a.slug === slug);
  return article || null;
}

export async function saveArticle(article: Partial<Article> & { title: string; content: string }): Promise<Article> {
  const db = ensureDatabase();
  const slug =
    article.slug ||
    article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const now = new Date().toISOString();

  if (article.id) {
    const idx = db.articles.findIndex((a) => a.id === article.id);
    if (idx >= 0) {
      const updated: Article = {
        ...db.articles[idx],
        ...article,
        slug,
        updated_at: now,
      };
      db.articles[idx] = updated;
      saveDatabase(db);
      return updated;
    }
  }

  const newArticle: Article = {
    id: "art-" + Math.random().toString(36).substring(2, 9),
    title: article.title,
    slug,
    category: article.category || "General Care",
    excerpt: article.excerpt || article.content.substring(0, 160) + "...",
    content: article.content,
    featured_image:
      article.featured_image ||
      "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop",
    author_name: article.author_name || "Pak Adenium Master Horticulturist",
    read_time_minutes: article.read_time_minutes || 5,
    is_published: article.is_published ?? true,
    seo_title: article.seo_title || `${article.title} | Pak Adenium Journal`,
    seo_description: article.seo_description || article.excerpt,
    created_at: now,
    updated_at: now,
  };

  db.articles.unshift(newArticle);
  saveDatabase(db);
  return newArticle;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const db = ensureDatabase();
  const initLen = db.articles.length;
  db.articles = db.articles.filter((a) => a.id !== id);
  if (db.articles.length !== initLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ==========================================
// SITE SETTINGS
// ==========================================
export async function getSiteSettings(): Promise<SiteSettings> {
  const db = ensureDatabase();
  return db.siteSettings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = ensureDatabase();
  db.siteSettings = {
    ...db.siteSettings,
    ...settings,
    general: { ...db.siteSettings.general, ...settings.general },
    shipping: { ...db.siteSettings.shipping, ...settings.shipping },
    payment_methods: { ...db.siteSettings.payment_methods, ...settings.payment_methods },
    announcement: { ...db.siteSettings.announcement, ...settings.announcement },
    homepage: { ...db.siteSettings.homepage, ...settings.homepage },
    seo: { ...db.siteSettings.seo, ...settings.seo },
    social: { ...db.siteSettings.social, ...settings.social },
  };
  saveDatabase(db);
  return db.siteSettings;
}

// ==========================================
// CUSTOMERS SERVICE
// ==========================================
export async function getCustomers(): Promise<Customer[]> {
  const db = ensureDatabase();
  const map = new Map<string, Customer>();

  for (const order of db.orders) {
    const rawKey = (order.customer_phone || order.customer_whatsapp || order.customer_name).trim().toLowerCase();
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
}

// ==========================================
// DASHBOARD METRICS
// ==========================================
export async function getDashboardMetrics() {
  const db = ensureDatabase();
  const totalOrders = db.orders.length;
  const pendingOrders = db.orders.filter((o) => o.order_status === "Pending").length;
  const completedOrders = db.orders.filter((o) => o.order_status === "Delivered").length;
  const cancelledOrders = db.orders.filter((o) => o.order_status === "Cancelled").length;
  const totalSales = db.orders
    .filter((o) => o.order_status !== "Cancelled")
    .reduce((acc, curr) => acc + curr.total, 0);

  const activeProducts = db.products.filter((p) => p.is_published).length;
  const lowStockProducts = db.products.filter(
    (p) => p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0
  );
  const outOfStockProducts = db.products.filter((p) => p.stock_quantity === 0);
  const recentOrders = db.orders.slice(0, 6);

  const customers = await getCustomers();

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
    totalProducts: db.products.length,
    activeProducts,
    totalCustomers: customers.length,
  };
}

