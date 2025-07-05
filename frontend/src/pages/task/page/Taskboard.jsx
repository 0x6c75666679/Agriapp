import React, { useState } from "react";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { Toaster } from "react-hot-toast";
import { useTaskManagement } from "../hooks/useTaskManagement";
import { useDragAndDrop } from "../hooks/useDragAndDrop";
// import { getStatusInfo, statusCards, getTaskTypes } from "../utils/statusUtils";

// Temporary fallback functions
const getStatusInfo = (tasks, status) => {
  const statusTasks = tasks.filter(task => task.status === status);
  const count = statusTasks.length;
  return { count };
};

const statusCards = [
  { status: 'Planned', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
  { status: 'Started', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  { status: 'In-Progress', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { status: 'Completed', bgColor: 'bg-green-100', textColor: 'text-green-700' },
];

const getTaskTypes = (tasks) => [
  {
    name: "Watering",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    badge: "bg-blue-100 text-blue-700",
    desc: "Water management tasks",
    count: tasks.filter(task => task.type === 'watering').length,
  },
  {
    name: "Fertilizing",
    color: "bg-green-50 border-green-200 text-green-700",
    badge: "bg-green-100 text-green-700",
    desc: "Nutrient application",
    count: tasks.filter(task => task.type === 'fertilization').length,
  },
  {
    name: "Monitoring",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700",
    desc: "Pest and health checks",
    count: tasks.filter(task => task.type === 'monitoring').length,
  },
  {
    name: "Harvesting",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    badge: "bg-purple-100 text-purple-700",
    desc: "Crop collection tasks",
    count: tasks.filter(task => task.type === 'harvesting').length,
  },
];
import TaskForm from "../components/TaskForm";
import UpdateTaskForm from "../components/UpdateTaskForm";
import TaskCard from "../components/TaskCard";
import StatusRow from "../components/StatusRow";
import ActionButtons from "../components/ActionButtons";
import Modal from "../components/Modal";
import ConfirmationDialog from "../components/ConfirmationDialog";

const Taskboard = () => {
  const { tasks, addTask, updateTask, deleteTask, deleteAllTasks, updateTaskStatus } = useTaskManagement();
  const { draggedTask, handleDragStart, handleDragOver, handleDrop, handleDragLeave } = useDragAndDrop(updateTaskStatus);

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarItems = [
    { label: 'Home' },
    { label: 'Rentals' },
    { label: 'Reports' },
    { label: 'Soil Testing' },
    { label: 'Marketplace' },
    { label: 'Community' },
    { label: 'Profile' },
  ];

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Mode states
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [isDeleteAllMode, setIsDeleteAllMode] = useState(false);
  const [isUpdateTaskMode, setIsUpdateTaskMode] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleCreateTask = (newTask) => {
    addTask(newTask);
    setShowCreateModal(false);
  };

  const handleUpdateTask = (updatedData) => {
    if (selectedTask) {
      updateTask(selectedTask.id, updatedData);
      setShowUpdateModal(false);
      setSelectedTask(null);
    }
  };

  const handleDeleteTask = () => {
    if (selectedTask && selectedTask.id) {
      console.log('Taskboard - handleDeleteTask called with selectedTask:', selectedTask);
      console.log('Taskboard - selectedTask.id:', selectedTask.id);
      deleteTask(selectedTask.id);
      setShowDeleteDialog(false);
      setSelectedTask(null);
    } else {
      console.error('Taskboard - Cannot delete task: No ID found in selectedTask:', selectedTask);
      alert('Cannot delete task: Task ID not found. Please refresh and try again.');
    }
  };

  const handleDeleteAllTasks = () => {
    deleteAllTasks();
    setShowDeleteAllDialog(false);
    setIsDeleteAllMode(false);
  };

  const handleTaskClick = (task) => {
    if (isDeleteMode) {
      setSelectedTask(task);
      setShowDeleteDialog(true);
    } else if (isUpdateTaskMode) {
      setSelectedTask(task);
      setShowUpdateModal(true);
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    // Deactivate other modes
    setIsDeleteAllMode(false);
    setIsUpdateTaskMode(false);
    setIsUpdateMode(false);
  };

  const toggleUpdateTaskMode = () => {
    setIsUpdateTaskMode(!isUpdateTaskMode);
    // Deactivate other modes
    setIsDeleteMode(false);
    setIsDeleteAllMode(false);
    setIsUpdateMode(false);
  };

  const toggleUpdateMode = () => {
    setIsUpdateMode(!isUpdateMode);
    // Deactivate other modes
    setIsDeleteMode(false);
    setIsDeleteAllMode(false);
    setIsUpdateTaskMode(false);
  };

  const toggleDeleteAllMode = () => {
    setIsDeleteAllMode(!isDeleteAllMode);
    // Deactivate other modes
    setIsDeleteMode(false);
    setIsUpdateTaskMode(false);
    setIsUpdateMode(false);
    
    // Show confirmation dialog after a short delay when entering delete all mode
    if (!isDeleteAllMode) {
      setTimeout(() => {
        setShowDeleteAllDialog(true);
      }, 300);
    }
  };

  const statuses = ["Planned", "Started", "In-Progress", "Completed"];
  const taskTypes = getTaskTypes(tasks);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className={`h-screen ${showDeleteDialog || showDeleteAllDialog || showUpdateModal || showCreateModal ? 'blur-sm' : ''}`}>
        <Sidebar sidebarCollapsed={sidebarCollapsed} sidebarItems={sidebarItems} />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className={`${showDeleteDialog || showDeleteAllDialog || showUpdateModal || showCreateModal ? 'blur-sm' : ''}`}>
          <Header sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} title={"Task-Manager"}/>
        </div>
        <div className={`p-6 ${showDeleteDialog || showDeleteAllDialog || showUpdateModal || showCreateModal ? 'blur-sm' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
            {/* Left column: Create Task + state buttons */}
            <div className="flex flex-col h-full w-full gap-4">
              {/* 1. Create Task card */}
              <div className="relative h-32 w-full">
                <div className="h-full w-full border rounded-lg p-4 flex flex-col justify-center items-center bg-white">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-green-700 font-semibold text-lg flex items-center justify-center focus:outline-none"
                    style={{ width: '100%', height: '100%' }}
                  >
                    + Create Task
                  </button>
                </div>
              </div>
              {/* Dynamic Status Cards */}
              {statusCards.map((card) => {
                const info = getStatusInfo(tasks, card.status);
                return (
                  <div key={card.status} className="relative h-32 w-full">
                    <div className={`h-full w-full border rounded-lg p-4 flex flex-col justify-center ${card.bgColor}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-lg ${card.textColor}`}>{card.status}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${card.bgColor.replace('bg-', 'bg-').replace('-100', '-200')} ${card.textColor}`}>
                          {info.count}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* 6. Delete Task button (original position) */}
              <div className="relative h-23 w-full">
                <div 
                  className={`h-full w-full border rounded-lg p-4 flex flex-col justify-center items-center cursor-pointer transition-colors hover:shadow-md ${isDeleteMode ? 'bg-red-200 border-red-400' : 'bg-red-100 hover:bg-red-200'}`}
                  onClick={toggleDeleteMode}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      toggleDeleteMode();
                    }
                  }}
                >
                  <span className={`font-semibold text-lg ${isDeleteMode ? 'text-red-800' : 'text-red-700'}`}>
                    {isDeleteMode ? 'Exit Delete Mode' : 'Delete Task'}
                  </span>
                </div>
              </div>
            </div>
            {/* Right four cards and black-bordered middle area */}
            <div className="md:col-span-4 flex flex-col gap-4 min-h-[600px]">
              <div className="flex gap-4">
                {taskTypes.slice(0, 4).map((type, idx) => (
                  <div key={type.name} className="relative h-32 w-full">
                    <div
                      className={`h-full w-full border rounded-lg p-4 flex flex-col justify-between ${type.color}`}
                      style={{ minHeight: '128px' }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold ${type.color.split(' ')[2]}`}>{type.name}</span>
                        <span className={`absolute top-3 right-4 text-xs px-2 py-1 rounded-full font-semibold ${type.badge}`}>{type.count}</span>
                      </div>
                      <span className={`text-xs ${type.color.split(' ')[2]}`}>{type.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Task rows organized by status */}
              {statuses.map((status) => (
                <StatusRow
                  key={status}
                  status={status}
                  tasks={tasks}
                  isUpdateMode={isUpdateMode}
                  isDeleteMode={isDeleteMode}
                  isDeleteAllMode={isDeleteAllMode}
                  isUpdateTaskMode={isUpdateTaskMode}
                  draggedTask={draggedTask}
                  onTaskClick={handleTaskClick}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              ))}

              {/* Action buttons row */}
              <ActionButtons
                isUpdateTaskMode={isUpdateTaskMode}
                isUpdateMode={isUpdateMode}
                isDeleteAllMode={isDeleteAllMode}
                onUpdateTaskClick={toggleUpdateTaskMode}
                onUpdateStatusClick={toggleUpdateMode}
                onDeleteAllClick={toggleDeleteAllMode}
              />
            </div>
          </div>
        </div>
        
        {/* Modals */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-2xl mx-auto">
              <TaskForm
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateTask}
              />
            </div>
          </div>
        )}

        {showUpdateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-2xl mx-auto">
              <UpdateTaskForm
                task={selectedTask}
                onClose={() => setShowUpdateModal(false)}
                onConfirm={handleUpdateTask}
              />
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Delete Task
                </h3>
                <p className="text-gray-600 mb-6">
                  Do you want to delete the task "{selectedTask.title}"?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteDialog(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    No
                  </button>
                  <button
                    onClick={handleDeleteTask}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete All Confirmation Dialog */}
        {showDeleteAllDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Delete All Tasks
                </h3>
                <p className="text-gray-600 mb-6">
                  Do you want to delete all tasks? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setShowDeleteAllDialog(false);
                      setIsDeleteAllMode(false);
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    No
                  </button>
                  <button
                    onClick={handleDeleteAllTasks}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Taskboard;
