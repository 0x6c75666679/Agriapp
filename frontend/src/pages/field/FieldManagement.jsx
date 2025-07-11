import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/components/Sidebar";
import Header from "../dashboard/components/Header";
import FieldList from "./FieldList";
import FieldForm from "./FieldForm";
import FieldDetails from "./FieldDetails";
import ConfirmationDialog from "../task/components/ConfirmationDialog";
import { useDragAndDropField } from "./useDragAndDropField";
import { getFields, createField, updateField, deleteField, deleteAllFields, updateFieldStatus } from "../../api/fieldApi";
import { getTasks, getTasksByField } from "../../api/taskApi";
import { taskEventEmitter } from "../../utils/taskEventEmitter";

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

const sidebarItems = [
  { label: 'Home' },
  { label: 'Task Manager' },
  { label: 'Field Manager' },
  { label: 'Soil Testing' },
  { label: 'Marketplace' },
  { label: 'Community' },
  { label: 'Profile' },
];

const FieldManagement = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formInitial, setFormInitial] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsField, setDetailsField] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  // Action button modes
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isUpdateStatusMode, setIsUpdateStatusMode] = useState(false);
  const [isDeleteAllMode, setIsDeleteAllMode] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false); // for sidebar Delete Field
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false); // for Delete All
  const [isViewDetailsMode, setIsViewDetailsMode] = useState(false); // for View Details
  const [activeFilter, setActiveFilter] = useState(null); // for status filtering
  const [showStatusPopup, setShowStatusPopup] = useState(false); // for status update popup
  const [selectedFieldForStatus, setSelectedFieldForStatus] = useState(null); // field selected for status update
  const [relatedTasks, setRelatedTasks] = useState([]); // for storing tasks related to field being deleted

  // Function to refresh tasks from backend
  const refreshTasks = async () => {
    try {
      await getTasks();
      console.log('Tasks refreshed from backend');
      // Emit event to notify all components to refresh their task state
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
      // If API fails, assume there are tasks to be safe
      return true;
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
        // Fallback to initial fields if API fails
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
        setFields((prev) => prev.map((f) => (f.id === field.id ? { ...field, lastActivity: new Date().toISOString().slice(0, 10) } : f)));
        // Then call API in background
        await updateField(field.id, field);
      } else {
        // Create new field - add to local state immediately
        const newFieldWithId = { ...field, id: Date.now(), lastActivity: new Date().toISOString().slice(0, 10) };
        setFields((prev) => [...prev, newFieldWithId]);
        // Then call API in background
        await createField(field);
      }
      // Refresh tasks after field activity
      await refreshTasks();
    } catch (error) {
      console.error('Error saving field:', error);
      // Local state is already updated, so no need to update again
      // Refresh tasks even if field API fails
      await refreshTasks();
    }
  };

  // Edit
  const handleEdit = (field) => {
    setFormInitial(field);
    setShowForm(true);
  };

  // Delete
  const handleDeleteClick = async (field) => {
    console.log('handleDeleteClick called with field:', field);
    // Check if field has related tasks using the backend endpoint
    const hasTasks = await checkFieldHasTasks(field.id);
    console.log('Field has tasks:', hasTasks);
    
    if (hasTasks) {
      // Get related tasks to show error message
      const tasks = await getRelatedTasksForField(field.id);
      setRelatedTasks(tasks);
      setDeleteTarget(field);
      setShowDeleteModal(true);
    } else {
      // No tasks, proceed with deletion
      setRelatedTasks([]);
      setDeleteTarget(field);
      setShowDeleteModal(true);
    }
  };
  const confirmDelete = async () => {
    try {
      // Remove from local state immediately
      setFields((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      // Then call API in background
      await deleteField(deleteTarget.id);
      // Refresh tasks after field deletion
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting field:', error);
      // Local state is already updated, so no need to update again
      // Refresh tasks even if field API fails
      await refreshTasks();
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Details
  const handleDetails = (field) => {
    setDetailsField(field);
    setShowDetails(true);
  };

  // Status summary cards
  const statusCards = [
    { status: 'Planting', bgColor: 'bg-muddy-100', textColor: 'text-black-800' },
    { status: 'Growing', bgColor: 'bg-green-100', textColor: 'text-black-800' },
    { status: 'Harvesting', bgColor: 'bg-yellow-100', textColor: 'text-black-800' },
    { status: 'Inactive', bgColor: 'bg-gray-100', textColor: 'text-black-800' },
  ];

  const getStatusCount = (status) => fields.filter(f => f.status === status).length;

  // Toggle handlers
  const toggleUpdateMode = () => {
    setIsUpdateMode(!isUpdateMode);
    setIsUpdateStatusMode(false);
    setIsDeleteAllMode(false);
    setIsViewDetailsMode(false);
    setIsDeleteMode(false); // Reset sidebar delete mode
  };
  const toggleUpdateStatusMode = () => {
    setIsUpdateStatusMode(!isUpdateStatusMode);
    setIsUpdateMode(false);
    setIsDeleteAllMode(false);
    setIsViewDetailsMode(false);
    setIsDeleteMode(false); // Reset sidebar delete mode
  };
  const toggleDeleteAllMode = () => {
    setIsDeleteAllMode(!isDeleteAllMode);
    setIsUpdateMode(false);
    setIsUpdateStatusMode(false);
    setIsViewDetailsMode(false);
    setIsDeleteMode(false); // Reset sidebar delete mode
  };

  // Sidebar Delete Field logic
  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setIsUpdateMode(false);
    setIsUpdateStatusMode(false);
    setIsViewDetailsMode(false);
  };
  // Delete All logic
  const [fieldsWithTasks, setFieldsWithTasks] = useState([]); // for storing fields that have tasks
  const [deletableFields, setDeletableFields] = useState([]); // for storing fields that can be deleted
  
  const openDeleteAllModal = async () => {
    // Check all fields for tasks before showing modal
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
    setShowDeleteAllModal(true);
  };
  
  const closeDeleteAllModal = () => {
    setShowDeleteAllModal(false);
    setFieldsWithTasks([]);
    setDeletableFields([]);
  };
  
  const confirmDeleteAll = async () => {
    try {
      // Only delete fields that don't have tasks
      for (const field of deletableFields) {
        // Remove from local state immediately
        setFields((prev) => prev.filter((f) => f.id !== field.id));
        // Then call API in background
        await deleteField(field.id);
      }
      // Refresh tasks after deleting fields
      await refreshTasks();
    } catch (error) {
      console.error('Error deleting fields:', error);
      // Refresh tasks even if field API fails
      await refreshTasks();
    } finally {
      setShowDeleteAllModal(false);
      setFieldsWithTasks([]);
      setDeletableFields([]);
    }
  };

  // View Details logic
  const toggleViewDetailsMode = () => {
    setIsViewDetailsMode(!isViewDetailsMode);
    setIsUpdateMode(false);
    setIsUpdateStatusMode(false);
    setIsDeleteAllMode(false);
    setIsDeleteMode(false);
  };

  // Status filtering logic
  const handleStatusFilter = (status) => {
    if (activeFilter === status) {
      setActiveFilter(null); // Clear filter if same status is clicked
    } else {
      setActiveFilter(status); // Set new filter
    }
  };

  // Filter fields based on active filter
  let filteredFields;
  if (activeFilter) {
    filteredFields = fields.filter(field => field.status === activeFilter);
  } else {
    // Only show one field per status (the first found for each status)
    const seenStatuses = new Set();
    filteredFields = fields.filter(field => {
      if (!seenStatuses.has(field.status)) {
        seenStatuses.add(field.status);
        return true;
      }
      return false;
    });
  }

  // Drag-and-drop for status update only
  const handleFieldStatusUpdate = async (fieldId, newStatus) => {
    try {
      // Update local state immediately
      setFields((prev) =>
        prev.map((f) =>
          f.id === fieldId ? { ...f, status: newStatus, lastActivity: new Date().toISOString().slice(0, 10) } : f
        )
      );
      // Then call API in background
      await updateFieldStatus(fieldId, newStatus);
      // Refresh tasks after field status update
      await refreshTasks();
    } catch (error) {
      console.error('Error updating field status:', error);
      // Local state is already updated, so no need to update again
      // Refresh tasks even if field API fails
      await refreshTasks();
    }
  };

  // Handle status update via popup
  const handleStatusUpdateViaPopup = (field) => {
    setSelectedFieldForStatus(field);
    setShowStatusPopup(true);
  };

  // Update status from popup
  const updateStatusFromPopup = async (newStatus) => {
    if (selectedFieldForStatus) {
      await handleFieldStatusUpdate(selectedFieldForStatus.id, newStatus);
    }
    setShowStatusPopup(false);
    setSelectedFieldForStatus(null);
  };
  const {
    draggedField,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragLeave,
  } = useDragAndDropField(handleFieldStatusUpdate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex">
      <div className={`${showForm || showDeleteModal || showDeleteAllModal ? 'blur-sm' : ''} flex w-full`}>
        <Sidebar sidebarCollapsed={sidebarCollapsed} sidebarItems={sidebarItems} className="bg-green-100" />
        <div className="flex-1 overflow-hidden">
          <Header
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            title={"Field Management"}
            className="bg-green-50"
          />
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-lg font-semibold text-gray-600">Loading fields...</div>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
              {/* Left column: Add Field + status cards */}
              <div className="flex flex-col h-full w-full gap-4">
                {/* Add Field card */}
                <div className="relative h-32 w-full">
                  <div className="h-full w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center bg-green-200">
                    <button
                      onClick={() => { setFormInitial(null); setShowForm(true); }}
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
                        className={`h-full w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${activeFilter === card.status ? 
                          (card.status === 'Planting' ? 'bg-muddy-200' : 
                           card.status === 'Growing' ? 'bg-green-200' : 
                           card.status === 'Harvesting' ? 'bg-yellow-200' : 
                           'bg-gray-200') : card.bgColor}`}
                        onClick={() => handleStatusFilter(card.status)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleStatusFilter(card.status);
                          }
                        }}

                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold text-lg text-black`}>{card.status}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-semibold text-black`}>
                            {getStatusCount(card.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Place Delete Field button directly after Inactive card */}
                    {card.status === 'Inactive' && (
                      <div className="relative h-23 w-full">
                        <div 
                          className={`h-full w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors hover:shadow-md bg-red-100 hover:bg-red-200 ${isDeleteMode ? 'bg-red-200 border-red-400' : ''}`}
                          onClick={toggleDeleteMode}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              toggleDeleteMode();
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
              {/* Main content: header, field list */}
              <div className="md:col-span-4 flex flex-col gap-4 min-h-[600px] h-full relative">
                
                <section className="flex-1 flex flex-col">
                  <FieldList
                    fields={filteredFields}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onDetails={handleDetails}
                    isDeleteAllMode={isDeleteMode}
                    isUpdateMode={isUpdateMode}
                    isViewDetailsMode={isViewDetailsMode}
                    isUpdateStatusMode={isUpdateStatusMode}
                    handleDragStart={handleDragStart}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    handleDragLeave={handleDragLeave}
                    draggedField={draggedField}
                    statusCards={statusCards}
                    activeFilter={activeFilter}
                    onStatusUpdateViaPopup={handleStatusUpdateViaPopup}
                  />
                </section>
                {/* Action buttons row at the bottom */}
                <div className="grid grid-cols-4 gap-4 mt-auto">
                  <div 
                    className={`h-23 w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors hover:shadow-md bg-purple-100 hover:bg-purple-200 ${isUpdateMode ? 'bg-purple-200 border-purple-400' : ''}`}
                    onClick={toggleUpdateMode}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleUpdateMode();
                      }
                    }}
                  >
                    <span className="font-semibold text-lg text-black">
                      {isUpdateMode ? 'Exit Update Mode' : 'Update Field'}
                    </span>
                  </div>
                  <div 
                    className={`h-23 w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors hover:shadow-md bg-green-100 hover:bg-green-200 ${isViewDetailsMode ? 'bg-green-200 border-green-400' : ''}`}
                    onClick={toggleViewDetailsMode}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleViewDetailsMode();
                      }
                    }}
                  >
                    <span className="font-semibold text-lg text-black">
                      {isViewDetailsMode ? 'Exit View Details' : 'View Details'}
                    </span>
                  </div>
                  <div 
                    className={`h-23 w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors hover:shadow-md bg-blue-100 hover:bg-blue-200 ${isUpdateStatusMode ? 'bg-blue-200 border-blue-400' : ''}`}
                    onClick={toggleUpdateStatusMode}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        toggleUpdateStatusMode();
                      }
                    }}
                  >
                    <span className="font-semibold text-lg text-black">
                      {isUpdateStatusMode ? 'Exit Update Status' : 'Update Status'}
                    </span>
                  </div>
                  <div 
                    className="h-23 w-full border-2 border-black rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors hover:shadow-md bg-red-100 hover:bg-red-200"
                    onClick={openDeleteAllModal}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        openDeleteAllModal();
                      }
                    }}
                  >
                    <span className="font-semibold text-lg text-black">
                      Delete All
                    </span>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
      <FieldForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
        initialData={formInitial}
      />
      <FieldDetails
        open={showDetails}
        onClose={() => setShowDetails(false)}
        field={detailsField}
      />
      <ConfirmationDialog
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={relatedTasks.length > 0 ? () => setShowDeleteModal(false) : confirmDelete}
        title={relatedTasks.length > 0 ? "Cannot Delete Field" : "Delete Field?"}
        message={
          deleteTarget 
            ? relatedTasks.length > 0
              ? `❌ Cannot delete field "${deleteTarget.name}" because it has ${relatedTasks.length} related task(s):\n\n${relatedTasks.map(task => `• ${task.title} (${task.status})`).join('\n')}\n\nPlease delete or reassign these tasks first before deleting the field.`
              : `Are you sure you want to delete field "${deleteTarget.name}"? This cannot be undone.`
            : ''
        }
        confirmText={relatedTasks.length > 0 ? "OK" : "Yes, Delete"}
        cancelText="Cancel"
        confirmButtonClass={relatedTasks.length > 0 ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"}
      />
      <ConfirmationDialog
        isOpen={showDeleteAllModal}
        onClose={closeDeleteAllModal}
        onConfirm={fieldsWithTasks.length > 0 ? () => setShowDeleteAllModal(false) : confirmDeleteAll}
        title={fieldsWithTasks.length > 0 ? "Cannot Delete All Fields" : "Delete All Fields?"}
        message={
          fieldsWithTasks.length > 0
            ? `❌ Cannot delete all fields because ${fieldsWithTasks.length} field(s) have related tasks:\n\n${fieldsWithTasks.map(field => `• ${field.name} (${field.tasks.length} tasks)`).join('\n')}\n\nPlease delete or reassign these tasks first before deleting the fields.`
            : deletableFields.length > 0
            ? `Are you sure you want to delete ${deletableFields.length} field(s)? This cannot be undone.`
            : "No fields to delete."
        }
        confirmText={fieldsWithTasks.length > 0 ? "OK" : "Yes, Delete All"}
        cancelText="Cancel"
        confirmButtonClass={fieldsWithTasks.length > 0 ? "bg-gray-600 hover:bg-gray-700" : "bg-red-600 hover:bg-red-700"}
      />
      
      {/* Status Update Popup */}
      {showStatusPopup && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Update Status for "{selectedFieldForStatus?.name}"
            </h3>
            <div className="space-y-3">
              {statusCards.map((card) => (
                <button
                  key={card.status}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                    selectedFieldForStatus?.status === card.status
                      ? 'border-gray-400 bg-gray-100 cursor-not-allowed'
                      : 'border-black hover:border-blue-500 hover:bg-blue-50'
                  }`}
                  onClick={() => updateStatusFromPopup(card.status)}
                  disabled={selectedFieldForStatus?.status === card.status}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{card.status}</span>
                    {selectedFieldForStatus?.status === card.status && (
                      <span className="text-sm text-gray-500">Current</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStatusPopup(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldManagement;