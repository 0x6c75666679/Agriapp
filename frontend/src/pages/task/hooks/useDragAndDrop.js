import { useState } from 'react';

export const useDragAndDrop = (updateTaskStatus) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (e, task, isUpdateMode) => {
    if (!isUpdateMode) return;
    console.log('Starting drag for task:', task.title, 'from status:', task.status);
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, isUpdateMode) => {
    if (!isUpdateMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus, isUpdateMode) => {
    if (!isUpdateMode || !draggedTask) return;
    e.preventDefault();
    
    console.log('Dropping task:', draggedTask.title, 'to status:', newStatus);
    
    updateTaskStatus(draggedTask.id, newStatus);
    setDraggedTask(null);
  };

  const handleDragLeave = (e) => {
    // No visual feedback needed
  };

  return {
    draggedTask,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragLeave,
  };
}; 