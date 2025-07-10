import React, { useState } from "react";

const cropOptions = ["Tomato", "Wheat", "Corn", "Rice", "Potato"];
const statusOptions = ["Active", "Inactive"];

const FieldForm = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      area: "",
      crop: "",
      location: "",
      status: "Active",
      notes: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-lg relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700">×</button>
        <h2 className="text-2xl font-bold mb-4">{initialData ? "Edit Field" : "Add Field"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Field Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Area (e.g., 2 ha)</label>
            <input
              type="text"
              name="area"
              value={form.area}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Crop</label>
            <select
              name="crop"
              value={form.crop}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-400"
              required
            >
              <option value="">Select crop</option>
              {cropOptions.map((crop) => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-400"
              required
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-green-400"
              rows={3}
              placeholder="Optional notes about this field"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
            >
              Save Field
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FieldForm; 