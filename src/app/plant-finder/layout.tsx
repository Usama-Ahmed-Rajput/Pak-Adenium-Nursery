import type { Metadata } from "next";
import { buildOpenGraphMeta } from "@/lib/seo";

const finderTitle = "Adenium Plant Finder Quiz for Pakistan";
const finderDescription =
  "Answer a few quick questions to find the ideal Desert Rose plant, grafted Adenium variety, or caudex bonsai for your sunlight and garden space in Pakistan.";

export const metadata: Metadata = {
  title: finderTitle,
  description: finderDescription,
  alternates: {
    canonical: "/plant-finder",
  },
  openGraph: buildOpenGraphMeta({
    title: `${finderTitle} | Pak Adenium`,
    description: finderDescription,
    url: "/plant-finder",
  }),
  twitter: {
    card: "summary_large_image",
    title: `${finderTitle} | Pak Adenium`,
    description: finderDescription,
  },
};

export default function PlantFinderLayout({ children }: { children: React.ReactNode }) {
  return children;
}

