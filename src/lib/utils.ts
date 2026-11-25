import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Product, Order } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString("en-US")}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export function cleanPhoneForWhatsApp(phone: string): string {
  // Removes leading +, dashes, spaces, and leading 0 if replacing with 92
  let clean = phone.replace(/[^0-9]/g, "");
  if (clean.startsWith("03")) {
    clean = "92" + clean.substring(1);
  }
  return clean;
}

export function generateWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = cleanPhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function buildProductInquiryWhatsApp(
  product: Product,
  businessPhone: string,
  siteUrl: string
): string {
  const productUrl = `${siteUrl}/shop/${product.slug}`;
  const priceDisplay = formatPrice(product.sale_price ?? product.price);

  const message = [
    `Hello Pak Adenium Nursery,`,
    ``,
    `I am inquiring about this plant from your catalog:`,
    `🌿 *${product.name}*`,
    `• SKU: ${product.sku}`,
    `• Species: ${product.species}`,
    `• Caudex: ${product.caudex_size}`,
    `• Price: ${priceDisplay}`,
    `• Availability: ${product.stock_quantity > 0 ? "In Stock (" + product.stock_quantity + " left)" : "Inquire for batch"}`,
    ``,
    `Product Link: ${productUrl}`,
    ``,
    `Could you please share live video/photos of the current plant and dispatch details?`,
  ].join("\n");

  return generateWhatsAppLink(businessPhone, message);
}

export function buildOrderConfirmationWhatsApp(
  order: Order,
  businessPhone: string,
  siteUrl: string
): string {
  const itemsList = order.items
    .map((item, idx) => `${idx + 1}. ${item.product_name} (${item.product_sku}) × ${item.quantity} = ${formatPrice(item.total_price)}`)
    .join("\n");

  const message = [
    `🌿 *PAK ADENIUM NURSERY — NEW ORDER CONFIRMATION*`,
    `Order Number: *#${order.order_number}*`,
    ``,
    `*Customer Details:*`,
    `• Name: ${order.customer_name}`,
    `• Phone: ${order.customer_phone}`,
    `• City: ${order.city}, ${order.province}`,
    `• Address: ${order.shipping_address}`,
    ``,
    `*Items Ordered:*`,
    itemsList,
    ``,
    `• Subtotal: ${formatPrice(order.subtotal)}`,
    `• Shipping: ${order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : "FREE"}`,
    `• *Grand Total: ${formatPrice(order.total)}*`,
    `• Payment Method: *${order.payment_method}*`,
    ``,
    `Track Order: ${siteUrl}/order-lookup?order=${order.order_number}`,
    ``,
    `Thank you for growing with Pak Adenium!`,
  ].join("\n");

  return generateWhatsAppLink(businessPhone, message);
}

