"use client";

import React, { useState } from "react";
import { Check, Send, AlertCircle, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const subjectWithCity = formData.city.trim()
        ? `${formData.subject.trim() ? formData.subject.trim() + " " : ""}[City: ${formData.city.trim()}]`
        : formData.subject.trim();

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          subject: subjectWithCity || undefined,
          message: formData.message.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Inquiry form submission failed:", err);
      setError(err?.message || "Could not send message. Please reach us directly on WhatsApp.");
    } finally {
      setLoading(false);
    }
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
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-botanical-900 mb-1">
          Your Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
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
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="e.g. Inquiring about Dorset Horn plants"
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
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Tell us what you are looking for..."
          className="w-full bg-ivory border border-botanical-300 rounded-xl px-4 py-2.5 text-xs text-botanical-950 focus:outline-none focus:border-botanical-600"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 px-6 rounded-xl bg-botanical-900 hover:bg-botanical-950 text-ivory text-xs font-medium transition-colors shadow-card flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending Message...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Inquiry
          </>
        )}
      </button>
    </form>
  );
}
