import React from "react";

const ActionButtons = ({ 
  isUpdateTaskMode, 
  isUpdateMode, 
  isDeleteAllMode, 
  onUpdateTaskClick, 
  onUpdateStatusClick, 
  onDeleteAllClick 
}) => {
  return (
    <div className="flex gap-4 w-full -mt-4">
      <div 
        className={`flex-1 border-2 border-black rounded-lg h-23 flex items-center justify-center cursor-pointer transition-colors hover:shadow-md text-black ${isUpdateTaskMode ? 'bg-purple-200 border-purple-400' : 'bg-purple-100 hover:bg-purple-200'}`}
        onClick={onUpdateTaskClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onUpdateTaskClick();
          }
        }}
      >
        <span className={`font-semibold text-lg ${isUpdateTaskMode ? 'text-purple-800' : 'text-purple-700'}`}>
          {isUpdateTaskMode ? 'Exit Update Mode' : 'Update Task'}
        </span>
      </div>
      <div 
        className={`flex-1 border-2 border-black rounded-lg h-23 flex items-center justify-center cursor-pointer transition-colors hover:shadow-md text-black ${isUpdateMode ? 'bg-blue-200 border-blue-400' : 'bg-blue-100 hover:bg-blue-200'}`}
        onClick={onUpdateStatusClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onUpdateStatusClick();
          }
        }}
      >
        <span className={`font-semibold text-lg ${isUpdateMode ? 'text-blue-800' : 'text-blue-700'}`}>
          {isUpdateMode ? 'Exit Update Mode' : 'Update Status'}
        </span>
      </div>
      <div 
        className={`flex-1 border-2 border-black rounded-lg h-23 flex items-center justify-center cursor-pointer transition-colors hover:shadow-md text-black ${isDeleteAllMode ? 'bg-red-200 border-red-400' : 'bg-red-100 hover:bg-red-200'}`}
        onClick={onDeleteAllClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onDeleteAllClick();
          }
        }}
      >
        <span className={`font-semibold text-lg ${isDeleteAllMode ? 'text-red-800' : 'text-red-700'}`}>
          {isDeleteAllMode ? 'Deleting...' : 'Delete All'}
        </span>
      </div>
    </div>
  );
};

export default ActionButtons; 