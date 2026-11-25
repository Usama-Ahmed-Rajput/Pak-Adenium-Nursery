import React, { useState } from 'react';
import Image from 'next/image';
import { Edit3, X, Check } from 'lucide-react';

// Sample data – replace with real data from your Supabase or API
const initialInventory = [
  {
    id: '1',
    name: 'Adenium Obesum (Desert Rose)',
    stock: 15,
    picture: 'https://images.unsplash.com/photo-1587153248526-3156f8c361f5?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: '2',
    name: 'Grafted Adenium Arabicum',
    stock: 8,
    picture: 'https://images.unsplash.com/photo-1546435252-7e8d385c56c1?auto=format&fit=crop&w=300&q=80',
  },
];

/**
 * InventoryItemEdit – displays a list of inventory items.
 * Each row shows the item picture, name and stock, plus an **Edit** button.
 * Clicking **Edit** opens an inline edit row where the user can change the
 *   • name
 *   • picture URL
 *   • stock (optional)
 *   • save / cancel actions.
 *
 * You can replace the `saveChanges` implementation with a call to your
 * Supabase `adjustInventory` or a custom API endpoint.
 */
export default function InventoryItemEdit() {
  const [inventory, setInventory] = useState(initialInventory);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ name: '', picture: '', stock: 0 });

  const startEdit = (item) => {
    setEditingId(item.id);
    setDraft({ name: item.name, picture: item.picture, stock: item.stock });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ name: '', picture: '', stock: 0 });
  };

  const saveChanges = async (id) => {
    // TODO: replace with actual API call (e.g., supabase update)
    const updated = inventory.map((it) =>
      it.id === id ? { ...it, name: draft.name, picture: draft.picture, stock: draft.stock } : it
    );
    setInventory(updated);
    cancelEdit();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Inventory – Pak Adenium Nursery</h2>
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Picture</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <tr key={item.id} className="border-t">
                {/* Picture */}
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={draft.picture}
                      onChange={(e) => setDraft({ ...draft, picture: e.target.value })}
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    <Image src={item.picture} alt={item.name} width={80} height={80} className="rounded" />
                  )}
                </td>
                {/* Name */}
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="w-full border rounded p-1"
                    />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </td>
                {/* Stock */}
                <td className="px-4 py-2">
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={draft.stock}
                      onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })}
                      className="w-20 border rounded p-1"
                    />
                  ) : (
                    <span>{item.stock}</span>
                  )}
                </td>
                {/* Actions */}
                <td className="px-4 py-2">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => saveChanges(item.id)}
                        className="flex items-center px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        <Check className="w-4 h-4 mr-1" /> Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center px-2 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                      >
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(item)}
                      className="flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Edit3 className="w-4 h-4 mr-1" /> Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

