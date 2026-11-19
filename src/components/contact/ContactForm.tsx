"use client";

import React, { useState } from "react";
import { Check, Send } from "lucide-react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
          <Check className="w-5 h-5" />
        </div>
        <h4 className="font-serif text-lg font-medium text-emerald-950">
          Message Received
        </h4>
        <p className="text-xs text-emerald-800 max-w-sm mx-auto">
          Thank you for reaching out. A horticulturist will contact you via WhatsApp/call shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-botanical-900 mb-1">
          Your Name *
        </label>
        <input
          type="text"
          required
          placeholder="e.g. Asad Ali"
          className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-xs text-botanical-950 focus:outline-none focus:border-botanical-600"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-botanical-900 mb-1">
            Phone / WhatsApp *
          </label>
          <input
            type="tel"
            required
            placeholder="03001234567"
            className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-xs text-botanical-950 focus:outline-none focus:border-botanical-600 font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-botanical-900 mb-1">
            City
          </label>
          <input
            type="text"
            placeholder="e.g. Lahore, Karachi"
            className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-xs text-botanical-950 focus:outline-none focus:border-botanical-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-botanical-900 mb-1">
          Subject / Variety Interested In
        </label>
        <input
          type="text"
          placeholder="e.g. Inquiring about Dorset Horn specimens"
          className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-xs text-botanical-950 focus:outline-none focus:border-botanical-600"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-botanical-900 mb-1">
          Message *
        </label>
        <textarea
          required
          rows={4}
          placeholder="Tell us what you are looking for..."
          className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-xs text-botanical-950 focus:outline-none focus:border-botanical-600"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3.5 px-6 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory text-xs font-medium transition-colors shadow-card flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        Submit Inquiry
      </button>
    </form>
  );
}

