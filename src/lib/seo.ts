import { SiteSettings } from "@/types";

export const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1596724806740-d9962a93fa21?q=80&w=1200&auto=format&fit=crop";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://pak-adenium-nursery.vercel.app").replace(/\/$/, "");
}

/**
 * Ensures meta descriptions stay within the 150-160 character SEO sweet spot,
 * trimming cleanly at a word boundary if a stored CMS value exceeds 160 chars.
 */
export function fitMetaDescription(text: string | undefined | null, fallback: string): string {
  const clean = (text || "").replace(/\s+/g, " ").trim();
  if (!clean) return fallback;
  if (clean.length <= 160) return clean;
  const sliced = clean.slice(0, 157);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 120 ? sliced.slice(0, lastSpace) : sliced).replace(/[.,;:!?-]+$/, "")}...`;
}

export function buildOpenGraphMeta(params: {
  title: string;
  description: string;
  url: string;
  siteName?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
}) {
  const siteName = params.siteName || "Pak Adenium";
  return {
    type: params.type || "website",
    locale: "en_PK",
    url: params.url,
    siteName,
    title: params.title,
    description: params.description,
    images: [
      {
        url: params.image || DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: params.imageAlt || `${siteName} — Desert Rose & Adenium Nursery in Pakistan`,
      },
    ],
  };
}

export function buildOrganizationSchema(settings: SiteSettings) {
  const siteUrl = getSiteUrl();
  const sameAs = [
    settings.social?.facebook,
    settings.social?.instagram,
    settings.social?.youtube,
  ].filter((url): url is string => Boolean(url && url.trim()));

  return {
    "@context": "https://schema.org",
    "@type": "GardenStore",
    "@id": `${siteUrl}/#organization`,
    name: settings.general.nursery_name || "Pak Adenium",
    alternateName: "Pak Adenium Nursery",
    url: siteUrl,
    description:
      "Pak Adenium is Pakistan's specialist botanical nursery cultivating Desert Rose (Adenium) plants, grafted multi-petal varieties, sculptural Arabicum caudex bonsai, and fresh Adenium seeds.",
    foundingDate: settings.general.founded_year || "2018",
    telephone: settings.general.phone,
    email: settings.general.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.general.address,
      addressCountry: "PK",
    },
    areaServed: {
      "@type": "Country",
      name: "Pakistan",
    },
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Bank Transfer, EasyPaisa, JazzCash",
    priceRange: "Rs. 1,450 - Rs. 35,000",
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildWebsiteSchema(siteName: string) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName || "Pak Adenium",
    url: siteUrl,
    inLanguage: "en-PK",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.path.startsWith("http")
        ? item.path
        : `${siteUrl}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function buildFaqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

