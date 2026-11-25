// src/components/AdminProductRow.jsx
"use client";

import React, { useState } from "react";
import { adjustInventory, saveProduct } from "@/lib/supabase/server"; // server utils can be called via API route – here we’ll use fetch wrappers

/**
 * Admin row for a single product showing an Edit button.
 * Clicking Edit opens a modal allowing the admin to change
 *  - name
 *  - picture URL (first image)
 *  - stock quantity (inventory level)
 *  The modal saves via Supabase RPC helpers.
 */
export default function AdminProductRow({ product, onUpdate }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: product.name,
    picture: product.images?.[0]?.image_url || "",
    stock: product.stock_quantity,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      // 1. Update product name & picture via saveProduct (partial update)
      await saveProduct({
        id: product.id,
        name: form.name,
        images: [{ image_url: form.picture, is_primary: true }],
      });

      // 2. Adjust inventory quantity
      await adjustInventory(product.id, Number(form.stock));

      // Notify parent to refetch list
      onUpdate && onUpdate();
      setShowModal(false);
    } catch (e) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <tr className="border-b hover:bg-gray-50">
        <td className="p-2">{product.name}</td>
        <td className="p-2">{product.stock_quantity}</td>
        <td className="p-2">
          <img
            src={product.images?.[0]?.image_url}
            alt={product.name}
            className="h-12 w-12 object-cover rounded"
          />
        </td>
        <td className="p-2">
          <button
            onClick={() => setShowModal(true)}
            className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
          >
            Edit
          </button>
        </td>
      </tr>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl mb-4 font-semibold">Edit Product</h2>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <label className="block mb-2">
              <span className="font-medium">Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded border p-2"
              />
            </label>
            <label className="block mb-2">
              <span className="font-medium">Picture URL</span>
              <input
                type="url"
                name="picture"
                value={form.picture}
                onChange={handleChange}
                className="mt-1 block w-full rounded border p-2"
              />
            </label>
            <label className="block mb-4">
              <span className="font-medium">Stock Quantity</span>
              <input
                type="number"
                min="0"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="mt-1 block w-full rounded border p-2"
              />
            </label>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                disabled={saving}
                className="rounded bg-gray-300 px-3 py-1 text-gray-800 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

