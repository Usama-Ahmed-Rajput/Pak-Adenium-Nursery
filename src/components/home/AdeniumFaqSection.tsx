import React from "react";
import Link from "next/link";
import { buildFaqSchema, FaqItem } from "@/lib/seo";
import { ArrowRight } from "lucide-react";

const ADENIUM_FAQS: FaqItem[] = [
  {
    question: "Where can I buy authentic Adenium plants in Pakistan?",
    answer:
      "You can buy outdoor-acclimated Adenium (Desert Rose) plants directly from Pak Adenium. We cultivate grafted multi-petal varieties, sculptural Adenium arabicum caudex bonsai, rare Dorset Horn hybrids, and fresh hand-pollinated Adenium seeds at our botanical farm with nationwide delivery across Pakistan.",
  },
  {
    question: "How does Pak Adenium ship live Desert Rose plants safely across Pakistan?",
    answer:
      "Pak Adenium ships plants nationwide to Lahore, Karachi, Islamabad, Rawalpindi, Multan, Faisalabad, Peshawar, and other cities in custom protective packaging. Depending on the variety and transit distance, plants are sent either bare-root or potted with a live unboxing guarantee.",
  },
  {
    question: "Which Adenium varieties thrive best in Pakistan's climate?",
    answer:
      "Adenium obesum, Adenium arabicum, and grafted multi-petal cultivars thrive in Pakistan's warm sun and summer temperatures above 45°C. When potted in a fast-draining coarse mineral substrate (pumice, gravel, and charcoal), they handle both intense heat and monsoon humidity.",
  },
  {
    question: "How do I care for Desert Rose plants and prevent caudex rot during monsoon?",
    answer:
      "Place your Adenium in full outdoor sun (6+ hours daily) and use a porous, non-peat mineral soil mix so excess rainwater drains in seconds. Reduce watering during humid monsoon spells and winter dormancy when temperatures drop.",
  },
  {
    question: "Does Pak Adenium sell fresh Adenium seeds in Pakistan?",
    answer:
      "Yes. Pak Adenium offers hand-pollinated hybrid Adenium seeds (Pack of 20) harvested from multi-petal and fat-caudex mother stock, along with our custom 5kg coarse mineral substrate formulation for healthy germination and root growth.",
  },
  {
    question: "What payment methods does Pak Adenium accept?",
    answer:
      "Pak Adenium accepts Cash, Bank Transfer, EasyPaisa, and JazzCash. You can place an order directly through our online store or confirm with our nursery team on WhatsApp.",
  },
];

export default function AdeniumFaqSection() {
  const faqSchema = buildFaqSchema(ADENIUM_FAQS);

  return (
    <section
      id="adenium-faq"
      className="py-20 sm:py-24 bg-white text-[#1D211D] border-t border-[#E5E0D8]"
      aria-labelledby="adenium-faq-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E0D8]">
          <div>
            <span className="text-xs uppercase tracking-wider text-clay font-semibold block">
              Pak Adenium Guide &amp; FAQs
            </span>
            <h2
              id="adenium-faq-heading"
              className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#15271E] mt-1"
            >
              Growing &amp; Buying Adenium Plants in Pakistan
            </h2>
            <p className="text-sm text-[#525B52] max-w-2xl mt-2">
              Practical answers on Desert Rose varieties, outdoor care in Pakistan&rsquo;s heat and monsoon, Adenium seeds, and nationwide delivery from Pak Adenium.
            </p>
          </div>

          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#15271E] hover:text-clay transition-colors uppercase tracking-wider flex-shrink-0"
          >
            <span>Read Growing Journal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ADENIUM_FAQS.map((faq) => (
            <article
              key={faq.question}
              className="p-6 rounded-xl bg-[#FBF9F4] border border-[#E5E0D8] space-y-2.5"
            >
              <h3 className="font-serif text-lg font-normal text-[#15271E] leading-snug">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-[#525B52] leading-relaxed">
                {faq.answer}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

