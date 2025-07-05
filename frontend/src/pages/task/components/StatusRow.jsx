import React from "react";
import { getTasksByStatus, getStatusBadgeColor } from "../utils/taskUtils";
import TaskCard from "./TaskCard";

const StatusRow = ({ 
  status, 
  tasks, 
  isUpdateMode, 
  isDeleteMode, 
  isDeleteAllMode, 
  isUpdateTaskMode, 
  draggedTask, 
  onTaskClick, 
  onDragStart, 
  onDragOver, 
  onDragLeave, 
  onDrop 
}) => {
  const statusTasks = getTasksByStatus(tasks, status);
  
  return (
    <div 
      key={status}
      className="flex gap-4 mb-4"
      onDragOver={(e) => onDragOver(e, isUpdateMode)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status, isUpdateMode)}
    >
      {statusTasks.length > 0 ? (
        statusTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            isDeleteMode={isDeleteMode}
            isDeleteAllMode={isDeleteAllMode}
            isUpdateTaskMode={isUpdateTaskMode}
            isUpdateMode={isUpdateMode}
            draggedTask={draggedTask}
            onTaskClick={onTaskClick}
            onDragStart={(e) => onDragStart(e, task, isUpdateMode)}
          />
        ))
      ) : (
        <div className={`flex flex-col w-full h-32 p-2 bg-gray-50 border border-gray-200 rounded-lg shadow text-left justify-center ${status !== 'Planned' ? '-mt-4' : ''}`}>
          <div className="ml-2">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-400 text-base">No tasks</h3>
            </div>
            <div className="mb-1">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(status)}`}>
                {status}
              </span>
            </div>
            <div className="text-xs text-gray-400 mb-1">Empty</div>
            <div className="text-xs text-gray-400">No tasks in this status</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusRow; 