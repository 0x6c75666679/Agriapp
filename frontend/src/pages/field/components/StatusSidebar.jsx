import React from 'react';

const statusCards = [
  { status: 'Planting', bgColor: 'bg-muddy-100', textColor: 'text-black-800' },
  { status: 'Growing', bgColor: 'bg-green-100', textColor: 'text-black-800' },
  { status: 'Harvesting', bgColor: 'bg-yellow-100', textColor: 'text-black-800' },
  { status: 'Inactive', bgColor: 'bg-gray-100', textColor: 'text-black-800' },
];

const StatusSidebar = ({ 
  onAddField, 
  onStatusFilter, 
  onToggleDeleteMode, 
  getStatusCount, 
  activeFilter, 
  isDeleteMode 
}) => {
  return (
    <div className="flex flex-col h-full w-full gap-4">
      {/* Add Field card */}
      <div className="relative h-32 w-full">
        <div className="h-full w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center bg-green-200">
          <button
            onClick={onAddField}
            className="text-black font-semibold text-lg flex items-center justify-center focus:outline-none w-full h-full gap-2"
          >
            <span className="text-2xl font-bold">＋</span>
            <span>Add Field</span>
          </button>
        </div>
      </div>

      {/* Status Cards */}
      {statusCards.map((card, idx) => (
        <React.Fragment key={card.status}>
          <div className="relative h-32 w-full">
            <div 
              className={`h-full w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                activeFilter === card.status ? 
                  (card.status === 'Planting' ? 'bg-muddy-200' : 
                   card.status === 'Growing' ? 'bg-green-200' : 
                   card.status === 'Harvesting' ? 'bg-yellow-200' : 
                   'bg-gray-200') : card.bgColor
              }`}
              onClick={() => onStatusFilter(card.status)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onStatusFilter(card.status);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg text-black">{card.status}</span>
                <span className="text-xs px-2 py-1 rounded-full font-semibold text-black">
                  {getStatusCount(card.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Place Delete Field button directly after Inactive card */}
          {card.status === 'Inactive' && (
            <div className="relative h-23 w-full">
              <div 
                className={`h-full w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors hover:shadow-md bg-red-100 hover:bg-red-200 ${
                  isDeleteMode ? 'bg-red-200 border-red-400' : ''
                }`}
                onClick={onToggleDeleteMode}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onToggleDeleteMode();
                  }
                }}
              >
                <span className="font-semibold text-lg text-black">
                  {isDeleteMode ? 'Exit Delete Mode' : 'Delete Field'}
                </span>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StatusSidebar; 