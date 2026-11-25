import React, { useState } from 'react';

// Sample inventory data – replace with your real data source (e.g., Supabase, API)
const initialInventory = [
  { id: 1, name: 'Item A', stock: 12, image: '/images/item-a.png' },
  { id: 2, name: 'Item B', stock: 5, image: '/images/item-b.png' },
  { id: 3, name: 'Item C', stock: 30, image: '/images/item-c.png' },
];

/**
 * InventoryList – displays a table of inventory items.
 * Each row has an **Edit** button that opens an inline edit form.
 * Users can change the item name, stock level and picture URL.
 */
export default function InventoryList() {
  const [inventory, setInventory] = useState(initialInventory);
  const [editingId, setEditingId] = useState(null);
  // Temporary fields while editing – keep them together for easy reset.
  const [tempFields, setTempFields] = useState({ name: '', stock: '', image: '' });

  const startEdit = (item) => {
    setEditingId(item.id);
    setTempFields({ name: item.name, stock: item.stock, image: item.image });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempFields({ name: '', stock: '', image: '' });
  };

  const saveEdit = (id) => {
    setInventory((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              name: tempFields.name,
              stock: Number(tempFields.stock),
              image: tempFields.image,
            }
          : it
      )
    );
    cancelEdit();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempFields((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Inventory Management</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <tr key={item.id} className="border-t">
                <td className="border p-2 text-center">
                  {isEditing ? (
                    <input
                      type="text"
                      name="image"
                      value={tempFields.image}
                      onChange={handleChange}
                      placeholder="Image URL"
                      className="border rounded w-full"
                    />
                  ) : (
                    <img src={item.image} alt={item.name} className="h-12 mx-auto" />
                  )}
                </td>
                <td className="border p-2">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={tempFields.name}
                      onChange={handleChange}
                      className="border rounded w-full"
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="border p-2 text-center">
                  {isEditing ? (
                    <input
                      type="number"
                      name="stock"
                      value={tempFields.stock}
                      onChange={handleChange}
                      className="border rounded w-16 text-center"
                    />
                  ) : (
                    item.stock
                  )}
                </td>
                <td className="border p-2 text-center">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEdit(item)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
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

