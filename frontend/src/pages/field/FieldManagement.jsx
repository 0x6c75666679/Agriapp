import React, { useState } from "react";
import Sidebar from "../dashboard/components/Sidebar";
import Header from "../dashboard/components/Header";
import FieldList from "./FieldList";
import FieldForm from "./FieldForm";
import FieldDetails from "./FieldDetails";
import ConfirmationDialog from "../task/components/ConfirmationDialog";

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
  const [fields, setFields] = useState(initialFields);
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
  const [showStatusModal, setShowStatusModal] = useState(false); // for Update Status
  const [selectedFieldForStatus, setSelectedFieldForStatus] = useState(null); // for Update Status
  const [activeFilter, setActiveFilter] = useState(null); // for status filtering

  // Add or update field
  const handleFormSubmit = (field) => {
    if (field.id) {
      setFields((prev) => prev.map((f) => (f.id === field.id ? { ...field, lastActivity: new Date().toISOString().slice(0, 10) } : f)));
    } else {
      setFields((prev) => [
        ...prev,
        { ...field, id: Date.now(), lastActivity: new Date().toISOString().slice(0, 10) },
      ]);
    }
  };

  // Edit
  const handleEdit = (field) => {
    setFormInitial(field);
    setShowForm(true);
  };

  // Delete
  const handleDeleteClick = (field) => {
    setDeleteTarget(field);
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    setFields((prev) => prev.filter((f) => f.id !== deleteTarget.id));
    setShowDeleteModal(false);
    setDeleteTarget(null);
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
  const openDeleteAllModal = () => setShowDeleteAllModal(true);
  const closeDeleteAllModal = () => setShowDeleteAllModal(false);
  const confirmDeleteAll = () => {
    setFields([]);
    setShowDeleteAllModal(false);
  };

  // View Details logic
  const toggleViewDetailsMode = () => {
    setIsViewDetailsMode(!isViewDetailsMode);
    setIsUpdateMode(false);
    setIsUpdateStatusMode(false);
    setIsDeleteAllMode(false);
    setIsDeleteMode(false);
  };

  // Update Status logic
  const handleStatusUpdate = (field) => {
    setSelectedFieldForStatus(field);
    setShowStatusModal(true);
  };

  const confirmStatusUpdate = (newStatus) => {
    if (selectedFieldForStatus) {
      setFields((prev) => prev.map((f) => 
        f.id === selectedFieldForStatus.id 
          ? { ...f, status: newStatus, lastActivity: new Date().toISOString().slice(0, 10) }
          : f
      ));
    }
    setShowStatusModal(false);
    setSelectedFieldForStatus(null);
  };

  const cancelStatusUpdate = () => {
    setShowStatusModal(false);
    setSelectedFieldForStatus(null);
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
  const filteredFields = activeFilter 
    ? fields.filter(field => field.status === activeFilter)
    : fields;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex">
      <div className={`${showForm || showDeleteModal || showDeleteAllModal || showStatusModal ? 'blur-sm' : ''} flex w-full`}>
        <Sidebar sidebarCollapsed={sidebarCollapsed} sidebarItems={sidebarItems} className="bg-green-100" />
        <div className="flex-1 overflow-hidden">
          <Header
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            title={"Field Management"}
            className="bg-green-50"
          />
          <div className="p-6">
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
              <div className="md:col-span-4 flex flex-col gap-4 min-h-[600px] h-full">
                <section className="flex-1 flex flex-col">
                  <FieldList
                    fields={filteredFields}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onDetails={handleDetails}
                    onStatusUpdate={handleStatusUpdate}
                    isDeleteAllMode={isDeleteMode}
                    isUpdateMode={isUpdateMode}
                    isViewDetailsMode={isViewDetailsMode}
                    isUpdateStatusMode={isUpdateStatusMode}
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
        onConfirm={confirmDelete}
        title="Delete Field?"
        message={deleteTarget ? `Are you sure you want to delete field "${deleteTarget.name}"? This cannot be undone.` : ''}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
      <ConfirmationDialog
        isOpen={showDeleteAllModal}
        onClose={closeDeleteAllModal}
        onConfirm={confirmDeleteAll}
        title="Delete All Fields?"
        message="Are you sure you want to delete ALL fields? This cannot be undone."
        confirmText="Yes, Delete All"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
      {/* Status Update Modal */}
      {showStatusModal && selectedFieldForStatus && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl border-2 border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Update Status for "{selectedFieldForStatus.name}"</h3>
            <p className="text-gray-600 mb-6">Select a new status for this field:</p>
            <div className="space-y-3 mb-6">
              {['Planting', 'Growing', 'Harvesting', 'Inactive'].map((status) => (
                <button
                  key={status}
                  onClick={() => confirmStatusUpdate(status)}
                  className="w-full p-3 text-left border-2 border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors"
                >
                  <span className="font-semibold">{status}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={cancelStatusUpdate}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
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