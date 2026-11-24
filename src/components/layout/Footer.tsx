import React from "react";
import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin, ShieldCheck, Truck, Sparkles, Heart } from "lucide-react";

interface FooterProps {
  nurseryName?: string;
  tagline?: string;
  phone?: string;
  email?: string;
  address?: string;
  whatsappNumber?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export default function Footer({
  nurseryName = "Pak Adenium",
  tagline = "Pakistan's dedicated botanical nursery specializing in mature sculptural Desert Roses (Adenium obesum, Adenium arabicum, and rare collector hybrids). Propagated with patience, nurtured for extreme heat resilience.",
  phone = "+92 300 2560340",
  email = "inquiry@pakadenium.pk",
  address = "Pak Adenium Nursery, Karachi, Pakistan",
  whatsappNumber = "923002560340",
  social,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-botanical-950 text-ivory/80 border-t border-botanical-800">
      {/* Botanical Trust Banner */}
      <div className="border-b border-botanical-900 bg-botanical-900/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-botanical-800 flex items-center justify-center text-clay flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-ivory">Nationwide Live Plant Transit</h4>
              <p className="text-xs text-ivory/60">
                Specialized breathable bare-root & secured potted packaging across all Pakistan cities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-botanical-800 flex items-center justify-center text-clay flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-ivory">True-to-Lineage Guarantee</h4>
              <p className="text-xs text-ivory/60">
                Verified multi-petal parentage and genuine Thai & Arabic rootstock genetics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-botanical-800 flex items-center justify-center text-clay flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-ivory">Lifetime Horticultural Support</h4>
              <p className="text-xs text-ivory/60">
                Direct WhatsApp guidance for pruning, caudex lifting, and seasonal acclimation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-ivory text-botanical-950 flex items-center justify-center font-serif font-bold text-lg">
              {nurseryName.charAt(0) || "P"}
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-ivory">
              {nurseryName}
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-ivory/70 max-w-sm">
            {tagline}
          </p>

          <div className="pt-2 space-y-2 text-xs text-ivory/75">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-clay flex-shrink-0" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-clay flex-shrink-0" />
              <span>{phone} (Mon – Sat, 9:00 AM – 7:00 PM)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-clay flex-shrink-0" />
              <span>{email}</span>
            </div>
          </div>
        </div>

        {/* Botanical Varieties */}
        <div>
          <h3 className="font-serif text-sm font-semibold tracking-wider uppercase text-ivory mb-4">
            Living Collections
          </h3>
          <ul className="space-y-2.5 text-xs text-ivory/70">
            <li>
              <Link href="/shop?category=grafted-varieties" className="hover:text-clay transition-colors">
                Grafted Multi-Petal
              </Link>
            </li>
            <li>
              <Link href="/shop?category=adenium-arabicum" className="hover:text-clay transition-colors">
                Desert Rose Bonsai
              </Link>
            </li>
            <li>
              <Link href="/shop?category=rare-collector-hybrids" className="hover:text-clay transition-colors">
                Dorset Horn & Rare Forms
              </Link>
            </li>
            <li>
              <Link href="/shop?category=specimen-bonsai" className="hover:text-clay transition-colors">
                Mature Bonsai Trees
              </Link>
            </li>
            <li>
              <Link href="/shop?category=adenium-obesum" className="hover:text-clay transition-colors">
                Classic Desert Roses
              </Link>
            </li>
            <li>
              <Link href="/shop?category=seeds-and-care" className="hover:text-clay transition-colors">
                Fresh Seeds & Mineral Media
              </Link>
            </li>
          </ul>
        </div>

        {/* Horticultural Knowledge */}
        <div>
          <h3 className="font-serif text-sm font-semibold tracking-wider uppercase text-ivory mb-4">
            Plant Care Journal
          </h3>
          <ul className="space-y-2.5 text-xs text-ivory/70">
            <li>
              <Link href="/journal/art-of-caudex-fattening-pakistan-climate" className="hover:text-clay transition-colors">
                Fattening Adenium Caudex
              </Link>
            </li>
            <li>
              <Link href="/journal/monsoon-survival-protocol-adenium-rot-prevention" className="hover:text-clay transition-colors">
                Monsoon Rot Prevention
              </Link>
            </li>
            <li>
              <Link href="/journal/winter-dormancy-management-pakistan" className="hover:text-clay transition-colors">
                Winter Dormancy Guide
              </Link>
            </li>
            <li>
              <Link href="/plant-finder" className="hover:text-clay transition-colors flex items-center gap-1.5 text-clay font-medium">
                <span>Interactive Plant Finder</span>
                <Sparkles className="w-3 h-3" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Concierge */}
        <div>
          <h3 className="font-serif text-sm font-semibold tracking-wider uppercase text-ivory mb-4">
            Customer Care
          </h3>
          <ul className="space-y-2.5 text-xs text-ivory/70">
            <li>
              <Link href="/order-lookup" className="hover:text-clay transition-colors">
                Track Order Status
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-clay transition-colors">
                Our Propagation Story
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-clay transition-colors">
                Contact Nursery
              </Link>
            </li>
            <li>
              <a
                href={`https://wa.me/${whatsappNumber || phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#25D366] transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Live Chat</span>
              </a>
            </li>
            <li className="pt-2 border-t border-botanical-800">
              <Link href="/admin/login" className="text-ivory/50 hover:text-ivory transition-colors">
                Admin Portal Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="border-t border-botanical-900 py-6 bg-botanical-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ivory/50">
          <p>© {currentYear} Pak Adenium Nursery. Handcrafted botanical living sculptures. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Dispatched via TCS, Leopards & Daewoo Cargo</span>
            <span>·</span>
            <span>COD & Bank Transfer Supported</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

