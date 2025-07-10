import React from "react";

const FieldDetails = ({ open, onClose, field }) => {
  if (!open || !field) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-2xl relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700">×</button>
        <h2 className="text-2xl font-bold mb-4">{field.name} Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <div className="text-gray-500 text-sm mb-1">Area</div>
            <div className="font-semibold text-lg">{field.area}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Crop</div>
            <div className="font-semibold text-lg">{field.crop}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Location</div>
            <div className="font-semibold text-lg">{field.location}</div>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Status</div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${field.status === "Active" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"}`}>
              {field.status}
            </span>
          </div>
          <div>
            <div className="text-gray-500 text-sm mb-1">Last Activity</div>
            <div className="font-semibold text-lg">{field.lastActivity}</div>
          </div>
        </div>
        <div className="mb-4">
          <div className="text-gray-500 text-sm mb-1">Notes</div>
          <div className="bg-gray-50 rounded p-3 text-gray-700 min-h-[48px]">{field.notes || <span className="text-gray-400">No notes</span>}</div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetails; 