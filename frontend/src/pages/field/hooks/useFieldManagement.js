import { useState, useEffect } from 'react';
import { getFields, createField, updateField, deleteField, deleteAllFields, updateFieldStatus } from '../../../api/fieldApi';
import { getTasks, getTasksByField } from '../../../api/taskApi';
import { taskEventEmitter } from '../../../utils/taskEventEmitter';

const initialFields = [
  {
    id: 1,
    name: 'Field Alpha',
    status: 'Planting',
    crop: 'Corn',
    area: '2.5 ha',
    lastActivity: '2024-05-01',
  },
  {
    id: 2,
    name: 'Field Beta',
    status: 'Growing',
    crop: 'Wheat',
    area: '1.8 ha',
    lastActivity: '2024-05-03',
  },
  {
    id: 3,
    name: 'Field Gamma',
    status: 'Harvesting',
    crop: 'Rice',
    area: '3.0 ha',
    lastActivity: '2024-05-05',
  },
  {
    id: 4,
    name: 'Field Delta',
    status: 'Inactive',
    crop: 'Potatoes',
    area: '1.2 ha',
    lastActivity: '2024-04-28',
  },
];

export const useFieldManagement = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(null);
  const [relatedTasks, setRelatedTasks] = useState([]);
  const [fieldsWithTasks, setFieldsWithTasks] = useState([]);
  const [deletableFields, setDeletableFields] = useState([]);

  // Function to refresh tasks from backend
  const refreshTasks = async () => {
    try {
      await getTasks();
      console.log('Tasks refreshed from backend');
      taskEventEmitter.emit();
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    }
  };

  // Function to check if a field has related tasks using the backend endpoint
  const checkFieldHasTasks = async (fieldId) => {
    console.log('checkFieldHasTasks called with fieldId:', fieldId);
    try {
      console.log('About to call getTasksByField...');
      const tasks = await getTasksByField(fieldId);
      console.log(`Tasks found for field ${fieldId}:`, tasks);
      const hasTasks = tasks && tasks.length > 0;
      console.log('Has tasks:', hasTasks);
      return hasTasks;
    } catch (error) {
      console.error('Error checking field tasks:', error);
      return true; // If API fails, assume there are tasks to be safe
    }
  };

  // Function to get related tasks for a field
  const getRelatedTasksForField = async (fieldId) => {
    try {
      const tasks = await getTasksByField(fieldId);
      console.log(`Related tasks for field ${fieldId}:`, tasks);
      return tasks || [];
    } catch (error) {
      console.error('Error getting related tasks:', error);
      return [];
    }
  };

  // Fetch fields from backend
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const fieldsData = await getFields();
        setFields(fieldsData);
      } catch (error) {
        console.error('Error fetching fields:', error);
        setFields(initialFields);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  // Add or update field
  const handleFormSubmit = async (field) => {
    try {
      if (field.id) {
        // Update existing field - update local state immediately
        setFields((prev) => prev.map((f) => 
          f.id === field.id ? { ...field, lastActivity: new Date().toISOString().slice(0, 10) } : f
        ));
        // Then call API in background
        await updateField(field.id, field);
      } else {
        // Create new field - add to local state immediately
        const newFieldWithId = { ...field, id: Date.now(), lastActivity: new Date().toISOString().slice(0, 10) };
        setFields((prev) => [...prev, newFieldWithId]);
        // Then call API in background
        await createField(field);
      }
      await refreshTasks();
    } catch (error) {
      console.error('Error saving field:', error);
      await refreshTasks();
    }
  };

  // Delete single field
  const handleDeleteField = async (field) => {
    console.log('handleDeleteField called with field:', field);
    const hasTasks = await checkFieldHasTasks(field.id);
    console.log('Field has tasks:', hasTasks);
    
    if (hasTasks) {
      const tasks = await getRelatedTasksForField(field.id);
      setRelatedTasks(tasks);
      return { hasTasks: true, tasks };
    } else {
      setRelatedTasks([]);
      return { hasTasks: false, tasks: [] };
    }
  };

  const confirmDeleteField = async (fieldId) => {
    try {
      setFields((prev) => prev.filter((f) => f.id !== fieldId));
      await deleteField(fieldId);
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting field:', error);
      await refreshTasks();
    }
  };

  // Delete all fields
  const handleDeleteAllFields = async () => {
    const fieldsWithTasksList = [];
    const deletableFieldsList = [];
    
    for (const field of fields) {
      const hasTasks = await checkFieldHasTasks(field.id);
      if (hasTasks) {
        const tasks = await getRelatedTasksForField(field.id);
        fieldsWithTasksList.push({ ...field, tasks });
      } else {
        deletableFieldsList.push(field);
      }
    }
    
    setFieldsWithTasks(fieldsWithTasksList);
    setDeletableFields(deletableFieldsList);
    return { fieldsWithTasks: fieldsWithTasksList, deletableFields: deletableFieldsList };
  };

  const confirmDeleteAllFields = async () => {
    try {
      for (const field of deletableFields) {
        setFields((prev) => prev.filter((f) => f.id !== field.id));
        await deleteField(field.id);
      }
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting fields:', error);
      await refreshTasks();
    }
  };

  // Update field status
  const handleFieldStatusUpdate = async (fieldId, newStatus) => {
    try {
      setFields((prev) =>
        prev.map((f) =>
          f.id === fieldId ? { ...f, status: newStatus, lastActivity: new Date().toISOString().slice(0, 10) } : f
        )
      );
      await updateFieldStatus(fieldId, newStatus);
      await refreshTasks();
    } catch (error) {
      console.error('Error updating field status:', error);
      await refreshTasks();
    }
  };

  // Status filtering
  const handleStatusFilter = (status) => {
    if (activeFilter === status) {
      setActiveFilter(null);
    } else {
      setActiveFilter(status);
    }
  };

  // Filter fields based on active filter
  const getFilteredFields = () => {
    if (activeFilter) {
      return fields.filter(field => field.status === activeFilter);
    } else {
      const seenStatuses = new Set();
      return fields.filter(field => {
        if (!seenStatuses.has(field.status)) {
          seenStatuses.add(field.status);
          return true;
        }
        return false;
      });
    }
  };

  // Get status count
  const getStatusCount = (status) => fields.filter(f => f.status === status).length;

  // Clear related tasks state
  const clearRelatedTasks = () => {
    setRelatedTasks([]);
    setFieldsWithTasks([]);
    setDeletableFields([]);
  };

  return {
    // State
    fields,
    loading,
    activeFilter,
    relatedTasks,
    fieldsWithTasks,
    deletableFields,
    
    // Actions
    handleFormSubmit,
    handleDeleteField,
    confirmDeleteField,
    handleDeleteAllFields,
    confirmDeleteAllFields,
    handleFieldStatusUpdate,
    handleStatusFilter,
    clearRelatedTasks,
    
    // Computed values
    getFilteredFields,
    getStatusCount,
  };
}; 