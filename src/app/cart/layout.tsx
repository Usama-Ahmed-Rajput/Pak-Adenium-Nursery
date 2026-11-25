import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | Pak Adenium",
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}

