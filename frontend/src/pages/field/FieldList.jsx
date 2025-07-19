import React from "react";

const statusCards = [
  { status: 'Planting', bgColor: 'bg-muddy-100', textColor: 'text-black-800' },
  { status: 'Growing', bgColor: 'bg-green-100', textColor: 'text-black-800' },
  { status: 'Harvesting', bgColor: 'bg-yellow-100', textColor: 'text-black-800' },
  { status: 'Inactive', bgColor: 'bg-gray-100', textColor: 'text-black-800' },
];

const FieldList = ({ fields, onEdit, onDelete, onDetails, onStatusUpdate, addButton, activeFieldColor, isDeleteAllMode, isUpdateMode, isViewDetailsMode, isUpdateStatusMode, handleDragStart, handleDragOver, handleDrop, handleDragLeave, draggedField, activeFilter, onStatusUpdateViaPopup }) => {
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
    blueStatus: 'bg-blue-50 hover:bg-blue-100', // for update status mode
  };

  // Detect if filtered view: check if activeFilter is set
  const isFiltered = activeFilter !== null;

  // Group fields by status for main view
  const fieldsByStatus = statusCards.reduce((acc, card) => {
    acc[card.status] = fields.filter(f => f.status === card.status);
    return acc;
  }, {});

  return (
    <div className="w-full relative">
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
        {isFiltered ? (
          <>
            {fields.length === 0 ? (
              <div className="rounded-xl shadow p-2 border-2 border-dashed border-black w-full h-32 flex items-center justify-center text-gray-400 bg-white text-xl font-semibold min-h-[200px]">
                No field listed
              </div>
            ) : (
              <>
                {/* Show fields in filtered view */}
                {fields.map((field) => (
                  <div
                    key={field.id}
                    className={`
                      ${isDeleteAllMode ? 'bg-red-50 hover:bg-red-100' :
                        isUpdateMode ? 'bg-purple-50 hover:bg-purple-100' :
                        isViewDetailsMode ? 'bg-green-50 hover:bg-green-100' :
                        isUpdateStatusMode ? 'bg-blue-50 hover:bg-blue-100' :
                        (activeFieldColor ? activeBgMap[activeFieldColor] : (statusBgMap[field.status] || 'bg-white'))}
                      rounded-xl shadow p-2 border-2 border-black w-full h-32 transition-all duration-200
                      ${(isDeleteAllMode || isUpdateMode || isViewDetailsMode || isUpdateStatusMode) ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''}
                      ${isUpdateStatusMode ? 'cursor-grab active:cursor-grabbing' : ''}
                      ${draggedField?.id === field.id ? 'opacity-50' : ''}
                    `}
                    onClick={isDeleteAllMode ? () => onDelete(field) : isUpdateMode ? () => onEdit(field) : isViewDetailsMode ? () => onDetails(field) : isUpdateStatusMode ? (isFiltered ? () => onStatusUpdateViaPopup(field) : undefined) : undefined}
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
                        } else if (isUpdateStatusMode && isFiltered) {
                          onStatusUpdateViaPopup(field);
                        }
                      }
                    } : undefined}
                    draggable={isUpdateStatusMode}
                    onDragStart={isUpdateStatusMode ? (e) => handleDragStart(e, field, isUpdateStatusMode) : undefined}
                    onDragOver={isUpdateStatusMode ? (e) => handleDragOver(e, isUpdateStatusMode) : undefined}
                    onDrop={isUpdateStatusMode ? (e) => handleDrop(e, field.status, isUpdateStatusMode) : undefined}
                    onDragLeave={isUpdateStatusMode ? handleDragLeave : undefined}
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
                {/* Show empty status boxes for other statuses in filtered view */}
                {statusCards
                  .filter(card => card.status !== fields[0]?.status)
                  .map((card) => (
                    <div
                      key={card.status + '-empty-filtered'}
                      className={`rounded-xl shadow p-2 border-2 border-dashed w-full h-32 flex items-center justify-center text-gray-400 bg-white transition-colors duration-200
                        ${isUpdateStatusMode ? 'cursor-pointer' : ''}
                        ${draggedField && draggedField.status !== card.status && isUpdateStatusMode ? 'border-blue-400 bg-blue-50' : 'border-black'}`}
                      onDragOver={isUpdateStatusMode ? (e) => { handleDragOver(e, isUpdateStatusMode); } : undefined}
                      onDrop={isUpdateStatusMode ? (e) => { handleDrop(e, card.status, isUpdateStatusMode); } : undefined}
                      onDragLeave={isUpdateStatusMode ? handleDragLeave : undefined}
                    >
                      No field in this state
                    </div>
                  ))}
              </>
            )}
          </>
        ) : (
          statusCards.map((card) => {
            const fieldsForStatus = fieldsByStatus[card.status] || [];
            return fieldsForStatus.length > 0 ? (
              fieldsForStatus.map((field, idx) => (
                <div
                  key={field.id}
                  className={`
                    ${isDeleteAllMode ? 'bg-red-50 hover:bg-red-100' :
                      isUpdateMode ? 'bg-purple-50 hover:bg-purple-100' :
                      isViewDetailsMode ? 'bg-green-50 hover:bg-green-100' :
                      isUpdateStatusMode ? 'bg-blue-50 hover:bg-blue-100' :
                      (activeFieldColor ? activeBgMap[activeFieldColor] : (statusBgMap[field.status] || 'bg-white'))}
                    rounded-xl shadow p-2 border-2 border-black w-full h-32 transition-all duration-200
                    ${(isDeleteAllMode || isUpdateMode || isViewDetailsMode || isUpdateStatusMode) ? 'cursor-pointer hover:shadow-lg hover:scale-[1.02]' : ''}
                    ${isUpdateStatusMode ? 'cursor-grab active:cursor-grabbing' : ''}
                    ${draggedField?.id === field.id ? 'opacity-50' : ''}
                  `}
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
                  draggable={isUpdateStatusMode}
                  onDragStart={isUpdateStatusMode ? (e) => handleDragStart(e, field, isUpdateStatusMode) : undefined}
                  onDragOver={isUpdateStatusMode ? (e) => handleDragOver(e, isUpdateStatusMode) : undefined}
                  onDrop={isUpdateStatusMode ? (e) => handleDrop(e, field.status, isUpdateStatusMode) : undefined}
                  onDragLeave={isUpdateStatusMode ? handleDragLeave : undefined}
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
              ))
            ) : (
              <div
                key={card.status + '-empty'}
                className={`rounded-xl shadow p-2 border-2 border-dashed w-full h-32 flex items-center justify-center text-gray-400 bg-white transition-colors duration-200
                  ${isUpdateStatusMode ? 'cursor-pointer' : ''}
                  ${draggedField && draggedField.status !== card.status && isUpdateStatusMode ? 'border-blue-400 bg-blue-50' : 'border-black'}`}
                onDragOver={isUpdateStatusMode ? (e) => { handleDragOver(e, isUpdateStatusMode); } : undefined}
                onDrop={isUpdateStatusMode ? (e) => { handleDrop(e, card.status, isUpdateStatusMode); } : undefined}
                onDragLeave={isUpdateStatusMode ? handleDragLeave : undefined}
              >
                No field in this state
              </div>
            );
          })
        )}
      </div>
      {/* Card view for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {isFiltered ? (
          fields.length === 0 ? (
            <div className="rounded-xl shadow p-4 border-2 border-dashed border-black w-full flex items-center justify-center text-gray-400 bg-white text-xl font-semibold min-h-[200px]">
              No field listed
            </div>
          ) : (
            fields.map((field) => (
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
            ))
          )
        ) : (
          fields.map((field) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default FieldList; 