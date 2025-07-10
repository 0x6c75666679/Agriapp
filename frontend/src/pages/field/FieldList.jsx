import React from "react";

const FieldList = ({ fields, onEdit, onDelete, onDetails, onStatusUpdate, addButton, activeFieldColor, isDeleteAllMode, isUpdateMode, isViewDetailsMode, isUpdateStatusMode }) => {
  // Map status to background color
  const statusBgMap = {
    Planting: 'bg-muddy-100',
    Growing: 'bg-green-100',
    Harvesting: 'bg-yellow-100',
    Inactive: 'bg-gray-100',
  };
  const activeBgMap = {
    purple: 'bg-purple-200',
    blue: 'bg-blue-200',
    red: 'bg-red-200',
  };
  return (
    <div className="w-full">
      {/* Header row with column labels and Add Field button */}
      <div className="flex items-center bg-green-100 rounded-xl px-4 border-2 border-black" style={{ minHeight: '125px' }}>
        <div className="flex-1 font-semibold text-lg flex items-center justify-center text-center">Field Name</div>
        <div className="flex-1 font-semibold text-lg flex items-center justify-center text-center">Area</div>
        <div className="flex-1 font-semibold text-lg flex items-center justify-center text-center">Crop</div>
        <div className="flex-1 font-semibold text-lg flex items-center justify-center text-center">Location</div>
        <div className="flex-1 font-semibold text-lg flex items-center justify-center text-center">Status</div>
        <div className="flex-1 font-semibold text-lg flex items-center justify-center text-center">Last Activity</div>
      </div>
      {/* Card view for desktop (vertical stack, one per row) */}
      <div className="hidden md:flex md:flex-col md:gap-4 mt-4">
        {fields.map((field) => (
          <div
            key={field.id}
            className={`${isDeleteAllMode ? 'bg-red-50 hover:bg-red-100' : isUpdateMode ? 'bg-purple-50 hover:bg-purple-100' : isViewDetailsMode ? 'bg-green-50 hover:bg-green-100' : isUpdateStatusMode ? 'bg-blue-50 hover:bg-blue-100' : (activeFieldColor ? activeBgMap[activeFieldColor] : (statusBgMap[field.status] || 'bg-white'))} rounded-xl shadow p-2 border-2 border-black w-full h-32 transition-all duration-200 ${(isDeleteAllMode || isUpdateMode || isViewDetailsMode || isUpdateStatusMode) ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''}`}
            onClick={isDeleteAllMode ? () => onDelete(field) : isUpdateMode ? () => onEdit(field) : isViewDetailsMode ? () => onDetails(field) : isUpdateStatusMode ? () => onStatusUpdate(field) : undefined}
            role={(isDeleteAllMode || isUpdateMode || isViewDetailsMode || isUpdateStatusMode) ? 'button' : undefined}
            tabIndex={(isDeleteAllMode || isUpdateMode || isViewDetailsMode || isUpdateStatusMode) ? 0 : undefined}
            onKeyDown={(isDeleteAllMode || isUpdateMode || isViewDetailsMode || isUpdateStatusMode) ? (e) => {
              if ((e.key === 'Enter' || e.key === ' ')) {
                if (isDeleteAllMode) {
                  onDelete(field);
                } else if (isUpdateMode) {
                  onEdit(field);
                } else if (isViewDetailsMode) {
                  onDetails(field);
                } else if (isUpdateStatusMode) {
                  onStatusUpdate(field);
                }
              }
            } : undefined}
          >
            <div className="grid grid-cols-6 h-full">
              <div className="flex items-center justify-center h-full text-lg font-bold text-black px-2 truncate border-r last:border-r-0">{field.name}</div>
              <div className="flex items-center justify-center h-full text-lg text-black px-2 truncate border-r last:border-r-0">{field.area}</div>
              <div className="flex items-center justify-center h-full text-lg text-black px-2 truncate border-r last:border-r-0">{field.crop}</div>
              <div className="flex items-center justify-center h-full text-lg text-black px-2 truncate border-r last:border-r-0">{field.location || 'N/A'}</div>
              <div className="flex items-center justify-center h-full text-base text-black px-2 truncate border-r last:border-r-0">
                <span className={`px-2 py-1 rounded-full text-base font-semibold ${field.status === "Active" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"}`}>{field.status}</span>
              </div>
              <div className="flex items-center justify-center h-full text-lg text-black px-2 truncate">{field.lastActivity}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Card view for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {fields.map((field) => (
          <div key={field.id} className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border">
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg text-green-700">{field.name}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${field.status === "Active" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"}`}>
                {field.status}
              </span>
            </div>
            <div className="text-gray-600 text-sm">Crop: {field.crop} | Area: {field.area}</div>
            <div className="text-gray-500 text-xs">Location: {field.location}</div>
            <div className="text-gray-400 text-xs">Last: {field.lastActivity}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldList; 