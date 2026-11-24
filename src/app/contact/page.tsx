import React from "react";
import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";
import { getSiteSettings } from "@/lib/db";
import { MessageCircle, Phone, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Pak Adenium Nursery — WhatsApp & Farm Inquiries",
  description:
    "Get in touch with Pak Adenium Nursery. Inquire about current blooming varieties, order assistance, and live plant dispatch across Pakistan.",
};

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar
        announcement={settings.announcement}
        whatsappNumber={settings.general.whatsapp}
        phone={settings.general.phone}
        address={settings.general.address}
        nurseryName={settings.general.nursery_name}
      />
      <main className="flex-1 bg-ivory py-12 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-clay font-medium">
              We Love Talking Plants
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-botanical-950">
              Get in Touch with our Nursery
            </h1>
            <p className="text-sm text-charcoal-muted">
              Whether you are looking for a specific multi-petal variety, need unboxing advice, or wish to order in bulk, we are here to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Contact Channels Card */}
            <div className="md:col-span-5 rounded-3xl bg-botanical-900 text-ivory p-8 space-y-6 shadow-card">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-clay font-medium">
                  Direct Concierge
                </span>
                <h3 className="font-serif text-2xl font-medium text-ivory">
                  Instant WhatsApp Desk
                </h3>
                <p className="text-xs text-ivory/70 leading-relaxed">
                  For fastest response and live video previews of current plants, reach us on WhatsApp.
                </p>
              </div>

              <a
                href={`https://wa.me/${settings.general.whatsapp}?text=${encodeURIComponent(
                  "Hello Pak Adenium Nursery, I would like to speak to a grower."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] text-botanical-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-subtle hover:bg-[#20ba59] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-botanical-950" />
                <span>Chat on WhatsApp ({settings.general.phone || `+${settings.general.whatsapp}`})</span>
              </a>

              <div className="pt-4 border-t border-botanical-800 space-y-4 text-xs text-ivory/80">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-ivory">Direct Telephone:</span>
                    <span>{settings.general.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-ivory">Email Desk:</span>
                    <span>{settings.general.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-ivory">Growing Grounds:</span>
                    <span className="leading-relaxed">{settings.general.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-clay flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-medium text-ivory">Operating Hours:</span>
                    <span>Monday through Saturday: 9:00 AM – 7:00 PM PKT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Web Message Form */}
            <div className="md:col-span-7 rounded-3xl bg-white border border-botanical-200/80 p-8 shadow-subtle space-y-5">
              <h3 className="font-serif text-2xl font-medium text-botanical-950">
                Send a Botanical Inquiry
              </h3>
              <p className="text-xs text-charcoal-muted">
                Leave a note below and our team will get back to you within 24 hours.
              </p>

              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer
        nurseryName={settings.general.nursery_name}
        tagline={settings.general.tagline}
        phone={settings.general.phone}
        email={settings.general.email}
        address={settings.general.address}
        social={settings.social}
        whatsappNumber={settings.general.whatsapp}
      />
    </>
  );
}
