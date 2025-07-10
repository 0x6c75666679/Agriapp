import React from "react";
import { 
  getStatusColor, 
  getStatusBadgeColor, 
  getStatusMargin, 
  getPriorityBadgeColor, 
  getTypeBadgeColor,
  formatDateTime
} from "../utils/taskUtils";

const TaskCard = ({ 
  task, 
  isDeleteMode, 
  isDeleteAllMode, 
  isUpdateTaskMode, 
  isUpdateMode, 
  draggedTask, 
  onTaskClick, 
  onDragStart 
}) => {
  const getTaskCardClasses = () => {
    let baseClasses = `flex flex-col w-full h-32 p-2 border rounded-lg shadow text-left justify-center ${getStatusMargin(task.status)}`;
    
    if (isDeleteMode || isDeleteAllMode) {
      baseClasses += ' cursor-pointer border-red-400 bg-red-50 hover:bg-red-100 hover:shadow-lg transition-all duration-200';
    } else if (isUpdateTaskMode) {
      baseClasses += ' cursor-pointer border-purple-400 bg-purple-50 hover:bg-purple-100 hover:shadow-lg transition-all duration-200';
    } else if (isUpdateMode) {
      baseClasses += ' cursor-pointer active:cursor-grabbing border-indigo-400 bg-indigo-50 hover:bg-indigo-100 hover:shadow-lg transition-all duration-200';
    }
    
    if (!isDeleteMode && !isDeleteAllMode && !isUpdateTaskMode && !isUpdateMode) {
      baseClasses += ` ${getStatusColor(task.status)}`;
    }
    
    if (draggedTask?.id === task.id) {
      baseClasses += ' opacity-50';
    }
    
    return baseClasses;
  };

  return (
    <div
      key={task.id}
      className={getTaskCardClasses()}
      draggable={isUpdateMode}
      onDragStart={(e) => onDragStart(e, task, isUpdateMode)}
      onClick={() => onTaskClick(task)}
      role={isDeleteMode || isUpdateTaskMode ? "button" : undefined}
      tabIndex={isDeleteMode || isUpdateTaskMode ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onTaskClick(task);
        }
      }}
    >
      <div className="ml-2">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-semibold text-gray-800 text-base">{task.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${getTypeBadgeColor(task.category)}`}>
            {task.category}
          </span>
        </div>
        <div className="mb-1">
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(task.status)}`}>
            {task.status}
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-1">
          <div>Start: {formatDateTime(task.startDate, task.startTime)}</div>
          <div>Due: {formatDateTime(task.dueDate, task.dueTime)}</div>
        </div>
        <div className="text-xs text-gray-600">{task.description}</div>
      </div>
    </div>
  );
};

export default TaskCard; 