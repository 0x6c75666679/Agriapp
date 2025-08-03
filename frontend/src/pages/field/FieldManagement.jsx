import React from "react";
import Sidebar from "../dashboard/components/Sidebar";
import Header from "../dashboard/components/Header";
import FieldList from "./FieldList";
import FieldForm from "./FieldForm";
import FieldDetails from "./FieldDetails";
import ConfirmationDialog from "../task/components/ConfirmationDialog";
import StatusSidebar from "./components/StatusSidebar";
import ActionButtons from "./components/ActionButtons";
import StatusUpdatePopup from "./components/StatusUpdatePopup";
import { useDragAndDropField } from "./useDragAndDropField";
import { useFieldManagement } from "./hooks/useFieldManagement";
import { useFieldUI } from "./hooks/useFieldUI";

const sidebarItems = [
  { label: 'Home' },
  { label: 'Task Manager' },
  { label: 'Field Manager' },
  { label: 'Profile' },
];

const FieldManagement = () => {
  // Custom hooks
  const {
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
  } = useFieldManagement();

  const {
    // Modal states
    showForm,
    showDetails,
    showDeleteModal,
    showDeleteAllModal,
    showStatusPopup,

    // Data
    formInitial,
    detailsField,
    deleteTarget,
    selectedFieldForStatus,

    // Modes
    isUpdateMode,
    isUpdateStatusMode,
    isDeleteAllMode,
    isDeleteMode,
    isViewDetailsMode,

    // Sidebar
    sidebarCollapsed,
    setSidebarCollapsed,

    // Form handlers
    openForm,
    closeForm,

    // Details handlers
    openDetails,
    closeDetails,

    // Delete handlers
    openDeleteModal,
    closeDeleteModal,
    openDeleteAllModal,
    closeDeleteAllModal,

    // Status popup handlers
    openStatusPopup,
    closeStatusPopup,

    // Mode toggles
    toggleUpdateMode,
    toggleUpdateStatusMode,
    toggleDeleteAllMode,
    toggleDeleteMode,
    toggleViewDetailsMode,
    resetModes,
  } = useFieldUI();

  // Drag and drop
  const {
    draggedField,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragLeave,
  } = useDragAndDropField(handleFieldStatusUpdate);

  // Event handlers
  const handleEdit = (field) => {
    openForm(field);
  };

  const handleDeleteClick = async (field) => {
    const result = await handleDeleteField(field);
    if (result.hasTasks) {
      openDeleteModal(field);
    } else {
      openDeleteModal(field);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await confirmDeleteField(deleteTarget.id);
      closeDeleteModal();
      clearRelatedTasks();
    }
  };

  const handleCancelDelete = () => {
    closeDeleteModal();
    clearRelatedTasks();
  };

  const handleOpenDeleteAll = async () => {
    await handleDeleteAllFields();
    openDeleteAllModal();
  };

  const handleConfirmDeleteAll = async () => {
    await confirmDeleteAllFields();
    closeDeleteAllModal();
    clearRelatedTasks();
  };

  const handleCancelDeleteAll = () => {
    closeDeleteAllModal();
    clearRelatedTasks();
  };

  const handleStatusUpdateViaPopup = (field) => {
    openStatusPopup(field);
  };

  const handleStatusUpdateFromPopup = async (newStatus) => {
    if (selectedFieldForStatus) {
      await handleFieldStatusUpdate(selectedFieldForStatus.id, newStatus);
    }
    closeStatusPopup();
  };

  const handleAddField = () => {
    openForm();
  };

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
                {/* Left column: Status Sidebar */}
                <div className="flex flex-col h-full w-full gap-4">
                  <StatusSidebar
                    onAddField={handleAddField}
                    onStatusFilter={handleStatusFilter}
                    onToggleDeleteMode={toggleDeleteMode}
                    getStatusCount={getStatusCount}
                    activeFilter={activeFilter}
                    isDeleteMode={isDeleteMode}
                  />
                </div>

                {/* Main content: Field List and Action Buttons */}
                <div className="md:col-span-4 flex flex-col gap-4 min-h-[600px] h-full relative">
                  <section className="flex-1 flex flex-col">
                    <FieldList
                      fields={getFilteredFields()}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onDetails={openDetails}
                      isDeleteAllMode={isDeleteAllMode}
                      isUpdateMode={isUpdateMode}
                      isViewDetailsMode={isViewDetailsMode}
                      isUpdateStatusMode={isUpdateStatusMode}
                      handleDragStart={handleDragStart}
                      handleDragOver={handleDragOver}
                      handleDrop={handleDrop}
                      handleDragLeave={handleDragLeave}
                      draggedField={draggedField}
                      activeFilter={activeFilter}
                      onStatusUpdateViaPopup={handleStatusUpdateViaPopup}
                    />
                  </section>

                  {/* Action Buttons */}
                  <ActionButtons
                    isUpdateMode={isUpdateMode}
                    isViewDetailsMode={isViewDetailsMode}
                    isUpdateStatusMode={isUpdateStatusMode}
                    onToggleUpdateMode={toggleUpdateMode}
                    onToggleViewDetailsMode={toggleViewDetailsMode}
                    onToggleUpdateStatusMode={toggleUpdateStatusMode}
                    onOpenDeleteAllModal={handleOpenDeleteAll}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals and Popups */}
      <FieldForm
        open={showForm}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        initialData={formInitial}
      />

      <FieldDetails
        open={showDetails}
        onClose={closeDetails}
        field={detailsField}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={relatedTasks.length > 0 ? closeDeleteModal : handleConfirmDelete}
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

      {/* Delete All Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteAllModal}
        onClose={handleCancelDeleteAll}
        onConfirm={fieldsWithTasks.length > 0 ? () => setShowDeleteAllModal(false) : handleConfirmDeleteAll}
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
      <StatusUpdatePopup
        isOpen={showStatusPopup}
        selectedField={selectedFieldForStatus}
        onStatusUpdate={handleStatusUpdateFromPopup}
        onClose={closeStatusPopup}
      />
    </div>
  );
};

export default FieldManagement;