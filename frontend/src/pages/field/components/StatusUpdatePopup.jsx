import React from 'react';

const statusCards = [
  { status: 'Planting', bgColor: 'bg-muddy-100', textColor: 'text-black-800' },
  { status: 'Growing', bgColor: 'bg-green-100', textColor: 'text-black-800' },
  { status: 'Harvesting', bgColor: 'bg-yellow-100', textColor: 'text-black-800' },
  { status: 'Inactive', bgColor: 'bg-gray-100', textColor: 'text-black-800' },
];

const StatusUpdatePopup = ({ 
  isOpen, 
  selectedField, 
  onStatusUpdate, 
  onClose 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Update Status for "{selectedField?.name}"
        </h3>
        <div className="space-y-3">
          {statusCards.map((card) => (
            <button
              key={card.status}
              className={`w-full p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                selectedField?.status === card.status
                  ? 'border-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'border-black hover:border-blue-500 hover:bg-blue-50'
              }`}
              onClick={() => onStatusUpdate(card.status)}
              disabled={selectedField?.status === card.status}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{card.status}</span>
                {selectedField?.status === card.status && (
                  <span className="text-sm text-gray-500">Current</span>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdatePopup; 