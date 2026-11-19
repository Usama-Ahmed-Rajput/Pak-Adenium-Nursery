"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SiteSettings } from "@/types";
import {
  Check,
  Loader2,
  Save,
  Globe,
  Truck,
  CreditCard,
  Megaphone,
  Share2,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Building,
} from "lucide-react";

export default function SettingsManager({ initialSettings }: { initialSettings: SiteSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.settings);
        showNotification("Nursery settings and storefront policies updated successfully.", "success");
        router.refresh();
      } else {
        showNotification(data.error || "Failed to update settings.", "error");
      }
    } catch {
      showNotification("Network error while connecting to server.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl text-xs">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-xs transition-all ${
            notification.type === "success"
              ? "bg-emerald-950 text-emerald-100 border-emerald-700/60"
              : "bg-red-950 text-red-100 border-red-700/60"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* 1. Nursery Identity & Contact */}
      <div className="rounded-3xl bg-white border border-botanical-200 p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-botanical-100">
          <Building className="w-5 h-5 text-clay" />
          <div>
            <h2 className="font-serif text-base font-bold text-botanical-950">
              Nursery Identity & Contact Channels
            </h2>
            <span className="text-charcoal-muted text-[11px]">Core brand information, WhatsApp desk, and dispatch grounds.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-botanical-900 mb-1">Nursery Brand Name</label>
            <input
              type="text"
              required
              value={settings.general.nursery_name}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, nursery_name: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950 font-medium"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">Editorial Tagline</label>
            <input
              type="text"
              value={settings.general.tagline}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, tagline: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">
              WhatsApp Concierge Number (Country code format: 923001234567) *
            </label>
            <input
              type="text"
              required
              value={settings.general.whatsapp}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, whatsapp: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">
              Public Customer Support Phone
            </label>
            <input
              type="text"
              value={settings.general.phone}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, phone: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">Official Inquiry Email</label>
            <input
              type="email"
              value={settings.general.email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, email: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">Physical Dispatch Hub</label>
            <input
              type="text"
              value={settings.general.address}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  general: { ...settings.general, address: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950"
            />
          </div>
        </div>
      </div>

      {/* 2. Homepage Content & Hero */}
      <div className="rounded-3xl bg-white border border-botanical-200 p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-botanical-100">
          <Sparkles className="w-5 h-5 text-clay" />
          <div>
            <h2 className="font-serif text-base font-bold text-botanical-950">
              Homepage Content & Editorial Hero
            </h2>
            <span className="text-charcoal-muted text-[11px]">Customize headlines, value propositions, and calls to action.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-medium text-botanical-900 mb-1">
              Hero Headline *
            </label>
            <input
              type="text"
              required
              value={settings.homepage?.hero_headline || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  homepage: { ...settings.homepage, hero_headline: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-serif text-sm font-semibold text-botanical-950"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-botanical-900 mb-1">
              Hero Subtitle / Description *
            </label>
            <textarea
              rows={2}
              required
              value={settings.homepage?.hero_description || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  homepage: { ...settings.homepage, hero_description: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2 text-botanical-950"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">Primary CTA Button Label</label>
            <input
              type="text"
              value={settings.homepage?.hero_cta_text || "Explore Collection"}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  homepage: { ...settings.homepage, hero_cta_text: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">Primary CTA Target Link</label>
            <input
              type="text"
              value={settings.homepage?.hero_cta_link || "/shop"}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  homepage: { ...settings.homepage, hero_cta_link: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950 font-mono"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">Story Section Title</label>
            <input
              type="text"
              value={settings.homepage?.story_title || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  homepage: { ...settings.homepage, story_title: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-botanical-900 mb-1">Story Section Narrative</label>
            <textarea
              rows={2}
              value={settings.homepage?.story_description || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  homepage: { ...settings.homepage, story_description: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2 text-botanical-950"
            />
          </div>
        </div>
      </div>

      {/* 3. SEO & Search Optimization */}
      <div className="rounded-3xl bg-white border border-botanical-200 p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-botanical-100">
          <Search className="w-5 h-5 text-clay" />
          <div>
            <h2 className="font-serif text-base font-bold text-botanical-950">
              SEO & Search Engine Indexing
            </h2>
            <span className="text-charcoal-muted text-[11px]">Control public search title tags, meta descriptions, and social graph cards.</span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-botanical-900 mb-1">
              Storefront Title Tag
            </label>
            <input
              type="text"
              value={settings.seo?.meta_title || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: { ...settings.seo, meta_title: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950 font-medium"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">
              Meta Description (Google Snippet)
            </label>
            <textarea
              rows={2}
              value={settings.seo?.meta_description || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: { ...settings.seo, meta_description: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2 text-botanical-950"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">
              Social Sharing Image URL (OpenGraph Card)
            </label>
            <input
              type="url"
              value={settings.seo?.og_image || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  seo: { ...settings.seo, og_image: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
            />
          </div>
        </div>
      </div>

      {/* 4. Pakistan Shipping & Delivery Policy */}
      <div className="rounded-3xl bg-white border border-botanical-200 p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-botanical-100">
          <Truck className="w-5 h-5 text-clay" />
          <div>
            <h2 className="font-serif text-base font-bold text-botanical-950">
              Pakistan Shipping & Delivery Policy
            </h2>
            <span className="text-charcoal-muted text-[11px]">Courier rates, threshold for free live delivery, and dispatch schedule.</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-botanical-900 mb-1">
              Default Standard Shipping Fee (PKR)
            </label>
            <input
              type="number"
              min={0}
              value={settings.shipping.default_shipping_fee}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  shipping: {
                    ...settings.shipping,
                    default_shipping_fee: Number(e.target.value),
                  },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950 font-semibold"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">
              Free Shipping Order Threshold (PKR)
            </label>
            <input
              type="number"
              min={0}
              value={settings.shipping.free_shipping_threshold}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  shipping: {
                    ...settings.shipping,
                    free_shipping_threshold: Number(e.target.value),
                  },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950 font-semibold"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-medium text-botanical-900 mb-1">
              Transit Schedule & Protective Packing Notice
            </label>
            <textarea
              rows={2}
              value={settings.shipping.delivery_time_notes}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  shipping: {
                    ...settings.shipping,
                    delivery_time_notes: e.target.value,
                  },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2 text-botanical-950"
            />
          </div>
        </div>
      </div>

      {/* 5. Payment Methods & Bank Settlement */}
      <div className="rounded-3xl bg-white border border-botanical-200 p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-botanical-100">
          <CreditCard className="w-5 h-5 text-clay" />
          <div>
            <h2 className="font-serif text-base font-bold text-botanical-950">
              Payment Methods & Bank Accounts
            </h2>
            <span className="text-charcoal-muted text-[11px]">Configure payment options presented to customers during checkout.</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-6 pb-2 border-b border-botanical-100">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-botanical-900">
              <input
                type="checkbox"
                checked={settings.payment_methods.cod_enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payment_methods: {
                      ...settings.payment_methods,
                      cod_enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-clay"
              />
              <span>Cash on Delivery (COD) Enabled</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-medium text-botanical-900">
              <input
                type="checkbox"
                checked={settings.payment_methods.bank_transfer_enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payment_methods: {
                      ...settings.payment_methods,
                      bank_transfer_enabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 rounded text-clay"
              />
              <span>Bank Transfer / IBFT Enabled</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-botanical-900 mb-1">Bank Name</label>
              <input
                type="text"
                value={settings.payment_methods.bank_name}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payment_methods: {
                      ...settings.payment_methods,
                      bank_name: e.target.value,
                    },
                  })
                }
                className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950"
              />
            </div>

            <div>
              <label className="block font-medium text-botanical-900 mb-1">
                Account Title / Beneficiary
              </label>
              <input
                type="text"
                value={settings.payment_methods.bank_title}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payment_methods: {
                      ...settings.payment_methods,
                      bank_title: e.target.value,
                    },
                  })
                }
                className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950"
              />
            </div>

            <div>
              <label className="block font-medium text-botanical-900 mb-1">Account Number</label>
              <input
                type="text"
                value={settings.payment_methods.account_number}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payment_methods: {
                      ...settings.payment_methods,
                      account_number: e.target.value,
                    },
                  })
                }
                className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
              />
            </div>

            <div>
              <label className="block font-medium text-botanical-900 mb-1">IBAN</label>
              <input
                type="text"
                value={settings.payment_methods.iban}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    payment_methods: {
                      ...settings.payment_methods,
                      iban: e.target.value,
                    },
                  })
                }
                className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 6. Header Announcement Strip */}
      <div className="rounded-3xl bg-white border border-botanical-200 p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-botanical-100">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-5 h-5 text-clay" />
            <h2 className="font-serif text-base font-bold text-botanical-950">
              Top Announcement Strip
            </h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-botanical-900">
            <input
              type="checkbox"
              checked={settings.announcement.enabled}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement: { ...settings.announcement, enabled: e.target.checked },
                })
              }
              className="w-4 h-4 rounded text-clay"
            />
            <span>Active on Storefront</span>
          </label>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block font-medium text-botanical-900 mb-1">
              Banner Announcement Text
            </label>
            <input
              type="text"
              value={settings.announcement.text}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  announcement: { ...settings.announcement, text: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-botanical-950"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-botanical-900 mb-1">Banner Target Link</label>
              <input
                type="text"
                value={settings.announcement.link}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: { ...settings.announcement, link: e.target.value },
                  })
                }
                className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
              />
            </div>

            <div>
              <label className="block font-medium text-botanical-900 mb-1">
                Background Color (Hex)
              </label>
              <input
                type="text"
                value={settings.announcement.bg_color}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: { ...settings.announcement, bg_color: e.target.value },
                  })
                }
                className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
              />
            </div>

            <div>
              <label className="block font-medium text-botanical-900 mb-1">
                Text Color (Hex)
              </label>
              <input
                type="text"
                value={settings.announcement.text_color}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: { ...settings.announcement, text_color: e.target.value },
                  })
                }
                className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 7. Social Links */}
      <div className="rounded-3xl bg-white border border-botanical-200 p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-botanical-100">
          <Share2 className="w-5 h-5 text-clay" />
          <h2 className="font-serif text-base font-bold text-botanical-950">
            Social Media Channels
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-botanical-900 mb-1">Facebook URL</label>
            <input
              type="url"
              value={settings.social?.facebook || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  social: { ...settings.social, facebook: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">Instagram URL</label>
            <input
              type="url"
              value={settings.social?.instagram || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  social: { ...settings.social, instagram: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">YouTube Channel URL</label>
            <input
              type="url"
              value={settings.social?.youtube || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  social: { ...settings.social, youtube: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
            />
          </div>

          <div>
            <label className="block font-medium text-botanical-900 mb-1">TikTok Profile URL</label>
            <input
              type="url"
              value={settings.social?.tiktok || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  social: { ...settings.social, tiktok: e.target.value },
                })
              }
              className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 font-mono text-botanical-950"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-8 py-3.5 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory font-semibold text-xs flex items-center gap-2 shadow-card transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save All Nursery Configurations</span>
        </button>
      </div>
    </form>
  );
}
