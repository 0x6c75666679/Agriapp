import { useState } from 'react';

export const useFieldUI = () => {
  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  // Form and details data
  const [formInitial, setFormInitial] = useState(null);
  const [detailsField, setDetailsField] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedFieldForStatus, setSelectedFieldForStatus] = useState(null);

  // Action button modes
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isUpdateStatusMode, setIsUpdateStatusMode] = useState(false);
  const [isDeleteAllMode, setIsDeleteAllMode] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isViewDetailsMode, setIsViewDetailsMode] = useState(false);

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Form handlers
  const openForm = (initialData = null) => {
    setFormInitial(initialData);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormInitial(null);
  };

  // Details handlers
  const openDetails = (field) => {
    setDetailsField(field);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setDetailsField(null);
  };

  // Delete modal handlers
  const openDeleteModal = (field) => {
    setDeleteTarget(field);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  // Delete all modal handlers
  const openDeleteAllModal = () => {
    setShowDeleteAllModal(true);
  };

  const closeDeleteAllModal = () => {
    setShowDeleteAllModal(false);
  };

  // Status popup handlers
  const openStatusPopup = (field) => {
    setSelectedFieldForStatus(field);
    setShowStatusPopup(true);
  };

  const closeStatusPopup = () => {
    setShowStatusPopup(false);
    setSelectedFieldForStatus(null);
  };

  // Mode toggles
  const toggleUpdateMode = () => {
    setIsUpdateMode(!isUpdateMode);
    setIsUpdateStatusMode(false);
    setIsDeleteAllMode(false);
    setIsViewDetailsMode(false);
    setIsDeleteMode(false);
  };

  const toggleUpdateStatusMode = () => {
    setIsUpdateStatusMode(!isUpdateStatusMode);
    setIsUpdateMode(false);
    setIsDeleteAllMode(false);
    setIsViewDetailsMode(false);
    setIsDeleteMode(false);
  };

  const toggleDeleteAllMode = () => {
    setIsDeleteAllMode(!isDeleteAllMode);
    setIsUpdateMode(false);
    setIsUpdateStatusMode(false);
    setIsViewDetailsMode(false);
    setIsDeleteMode(false);
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setIsUpdateMode(false);
    setIsUpdateStatusMode(false);
    setIsViewDetailsMode(false);
  };

  const toggleViewDetailsMode = () => {
    setIsViewDetailsMode(!isViewDetailsMode);
    setIsUpdateMode(false);
    setIsUpdateStatusMode(false);
    setIsDeleteAllMode(false);
    setIsDeleteMode(false);
  };

  // Reset all modes
  const resetModes = () => {
    setIsUpdateMode(false);
    setIsUpdateStatusMode(false);
    setIsDeleteAllMode(false);
    setIsDeleteMode(false);
    setIsViewDetailsMode(false);
  };

  return {
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
  };
}; 