import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adenium Plant Finder Quiz — Find Your Ideal Desert Rose",
  description:
    "Answer a few quick questions to find the best Adenium plant or Desert Rose bonsai for your home, balcony, or garden in Pakistan from Pak Adenium.",
  alternates: {
    canonical: "/plant-finder",
  },
  openGraph: {
    title: "Adenium Plant Finder | Pak Adenium Pakistan",
    description:
      "Match with the right Desert Rose variety, caudex bonsai, or Adenium seeds for your sunlight and space in Pakistan.",
    url: "/plant-finder",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adenium Plant Finder | Pak Adenium",
    description:
      "Find the ideal Desert Rose (Adenium) plant for your climate and garden space in Pakistan.",
  },
};

export default function PlantFinderLayout({ children }: { children: React.ReactNode }) {
  return children;
}

