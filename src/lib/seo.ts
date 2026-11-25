import { SiteSettings } from "@/types";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://pakadenium.pk").replace(/\/$/, "");
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

