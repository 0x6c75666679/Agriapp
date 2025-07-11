import { useState } from 'react';

export const useDragAndDropField = (updateFieldStatus) => {
  const [draggedField, setDraggedField] = useState(null);

  const handleDragStart = (e, field, isUpdateStatusMode) => {
    if (!isUpdateStatusMode) return;
    setDraggedField(field);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, isUpdateStatusMode) => {
    if (!isUpdateStatusMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus, isUpdateStatusMode) => {
    if (!isUpdateStatusMode || !draggedField) return;
    e.preventDefault();
    updateFieldStatus(draggedField.id, newStatus);
    setDraggedField(null);
  };

  const handleDragLeave = (e) => {
    // No visual feedback needed
  };

  return {
    draggedField,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragLeave,
  };
}; 