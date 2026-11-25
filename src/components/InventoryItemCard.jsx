import React, { useState } from 'react';
import { Edit } from 'lucide-react';

// Simple edit modal (you can replace with your own modal library)
function EditModal({ item, onClose, onSave }) {
  const [name, setName] = useState(item.name);
  const [picture, setPicture] = useState(item.image);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...item, name, image: picture });
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30" onClick={onClose}>
      <div className="bg-white rounded p-4 w-80" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-2">Edit Item</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Picture URL</label>
            <input
              type="url"
              value={picture}
              onChange={(e) => setPicture(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="px-3 py-1 text-sm border rounded">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 text-sm bg-emerald-600 text-white rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InventoryItemCard({ item, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (updated) => {
    setIsEditing(false);
    // Call parent update (you can also call Supabase RPC here)
    if (onUpdate) onUpdate(updated);
  };

  return (
    <div className="border rounded p-3 flex items-center space-x-4">
      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        <p className="text-xs text-gray-500">Stock: {item.stock}</p>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 text-gray-600 hover:text-emerald-600"
        title="Edit name & picture"
      >
        <Edit className="w-5 h-5" />
      </button>

      {isEditing && (
        <EditModal item={item} onClose={() => setIsEditing(false)} onSave={handleSave} />
      )}
    </div>
  );
}

