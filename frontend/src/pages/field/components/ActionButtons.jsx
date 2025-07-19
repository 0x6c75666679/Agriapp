import React from 'react';

const ActionButtons = ({
  isUpdateMode,
  isViewDetailsMode,
  isUpdateStatusMode,
  onToggleUpdateMode,
  onToggleViewDetailsMode,
  onToggleUpdateStatusMode,
  onOpenDeleteAllModal
}) => {
  return (
    <div className="grid grid-cols-4 gap-4 mt-auto">
      <div 
        className={`h-23 w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors hover:shadow-md bg-purple-100 hover:bg-purple-200 ${
          isUpdateMode ? 'bg-purple-200 border-purple-400' : ''
        }`}
        onClick={onToggleUpdateMode}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onToggleUpdateMode();
          }
        }}
      >
        <span className="font-semibold text-lg text-black">
          {isUpdateMode ? 'Exit Update Mode' : 'Update Field'}
        </span>
      </div>

      <div 
        className={`h-23 w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors hover:shadow-md bg-green-100 hover:bg-green-200 ${
          isViewDetailsMode ? 'bg-green-200 border-green-400' : ''
        }`}
        onClick={onToggleViewDetailsMode}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onToggleViewDetailsMode();
          }
        }}
      >
        <span className="font-semibold text-lg text-black">
          {isViewDetailsMode ? 'Exit View Details' : 'View Details'}
        </span>
      </div>

      <div 
        className={`h-23 w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors hover:shadow-md bg-blue-100 hover:bg-blue-200 ${
          isUpdateStatusMode ? 'bg-blue-200 border-blue-400' : ''
        }`}
        onClick={onToggleUpdateStatusMode}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onToggleUpdateStatusMode();
          }
        }}
      >
        <span className="font-semibold text-lg text-black">
          {isUpdateStatusMode ? 'Exit Update Status' : 'Update Status'}
        </span>
      </div>

      <div 
        className="h-23 w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors hover:shadow-md bg-red-100 hover:bg-red-200"
        onClick={onOpenDeleteAllModal}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onOpenDeleteAllModal();
          }
        }}
      >
        <span className="font-semibold text-lg text-black">
          Delete All
        </span>
      </div>
    </div>
  );
};

export default ActionButtons; 