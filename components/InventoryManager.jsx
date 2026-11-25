import React, { useEffect, useState } from 'react';
import { getProducts, adjustInventory, saveProduct } from '@/lib/supabase/client';
import Modal from '@/components/Modal'; // assume a generic modal component exists or create a simple one inline

/**
 * InventoryManager – list all products with an Edit button.
 * Allows editing of the product name, stock quantity, and picture URL.
 * Uses the existing Supabase helpers (`getProducts`, `adjustInventory`, `saveProduct`).
 */
export default function InventoryManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // product being edited

  // Load inventory on mount
  useEffect(() => {
    (async () => {
      const list = await getProducts({ inStockOnly: false });
      setProducts(list);
      setLoading(false);
    })();
  }, []);

  const openEdit = (product) => {
    setEditing({
      ...product,
      // keep a temporary copy for the form
      tempName: product.name,
      tempStock: product.stock_quantity,
      tempPicture: product.images?.[0]?.image_url || '',
    });
  };

  const closeEdit = () => setEditing(null);

  const saveChanges = async () => {
    if (!editing) return;
    const { id, tempName, tempStock, tempPicture } = editing;
    // 1️⃣ Update name & picture via saveProduct (upsert)
    await saveProduct({
      id,
      name: tempName,
      // picture handling – replace the first image or add a new one
      images: [{
        id: editing.images?.[0]?.id || undefined,
        image_url: tempPicture,
        alt_text: tempName,
        is_primary: true,
        display_order: 1,
      }],
    });
    // 2️⃣ Adjust inventory quantity
    await adjustInventory(id, Number(tempStock));
    // Refresh list
    const refreshed = await getProducts({ inStockOnly: false });
    setProducts(refreshed);
    closeEdit();
  };

  if (loading) return <p className="p-4">Loading inventory…</p>;

  return (
    <div className="p-4">
      <h2 className="mb-4 text-2xl font-semibold">Pak Adenium Nursery – Inventory</h2>
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Picture</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Stock</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const picture = p.images?.[0]?.image_url || 'https://via.placeholder.com/80';
            return (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-2">
                  <img src={picture} alt={p.name} className="h-12 w-12 object-cover rounded" />
                </td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.stock_quantity}</td>
                <td className="p-2">
                  <button
                    onClick={() => openEdit(p)}
                    className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded p-6 w-96">
            <h3 className="mb-4 text-lg font-medium">Edit Product</h3>
            <label className="block mb-2">
              Name:
              <input
                type="text"
                value={editing.tempName}
                onChange={(e) => setEditing({ ...editing, tempName: e.target.value })}
                className="mt-1 w-full rounded border p-1"
              />
            </label>
            <label className="block mb-2">
              Stock Quantity:
              <input
                type="number"
                min="0"
                value={editing.tempStock}
                onChange={(e) => setEditing({ ...editing, tempStock: e.target.value })}
                className="mt-1 w-full rounded border p-1"
              />
            </label>
            <label className="block mb-4">
              Picture URL:
              <input
                type="url"
                value={editing.tempPicture}
                onChange={(e) => setEditing({ ...editing, tempPicture: e.target.value })}
                className="mt-1 w-full rounded border p-1"
              />
            </label>
            <div className="flex justify-end space-x-2">
              <button onClick={closeEdit} className="rounded bg-gray-400 px-3 py-1 text-white hover:bg-gray-500">
                Cancel
              </button>
              <button onClick={saveChanges} className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

