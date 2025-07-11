import React, { useState } from "react";
import { useTaskManagement } from "../task/hooks/useTaskManagement";
import UpdateTaskForm from "../task/components/UpdateTaskForm";

const statusColorMap = {
  Planned: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-yellow-100 text-yellow-700',
  Started: 'bg-yellow-100 text-yellow-700',
  Done: 'bg-green-100 text-green-700',
  Completed: 'bg-green-100 text-green-700',
  Pending: 'bg-gray-100 text-gray-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const FieldDetails = ({ open, onClose, field }) => {
  const { tasks, loading } = useTaskManagement();
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  if (!open || !field) return null;

  // Filter tasks for this field (by name or id)
  const fieldTasks = tasks.filter(
    (task) =>
      task.field === field.name ||
      task.field === field.id ||
      task.fieldId === field.id ||
      (task.field && field.name && task.field.toLowerCase() === field.name.toLowerCase())
  );

  // Handler to open update dialog for a task
  const handleUpdateTask = (task) => {
    setTaskToUpdate(task);
    setShowUpdateDialog(true);
  };
  // Handler to close update dialog
  const handleCloseUpdate = () => {
    setTaskToUpdate(null);
    setShowUpdateDialog(false);
  };
  // Handler to confirm update (you may want to update tasks here)
  const handleConfirmUpdate = (updatedTaskData) => {
    // You may want to update the task in your state or refetch tasks
    setTaskToUpdate(null);
    setShowUpdateDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-0 w-full max-w-4xl relative animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-6 pb-2 border-b border-gray-100 bg-white/80">
          <h2 className="text-3xl font-bold text-gray-900">{field.name}</h2>
          <button onClick={onClose} className="text-3xl text-gray-400 hover:text-gray-700 focus:outline-none transition-colors">
            <span className="sr-only">Close</span>×
          </button>
        </div>
        {/* Field Info */}
        <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
          <div>
            <div className="text-gray-600 text-sm font-medium mb-1">Area</div>
            <div className="font-semibold text-lg text-gray-800">{field.area}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm font-medium mb-1">Crop</div>
            <div className="font-semibold text-lg text-gray-800">{field.crop}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm font-medium mb-1">Location</div>
            <div className="font-semibold text-lg text-gray-800">{field.location}</div>
          </div>
          <div>
            <div className="text-gray-600 text-sm font-medium mb-1">Status</div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${field.status === "Active" ? "bg-green-200 text-green-800" : "bg-gray-200 text-gray-600"}`}>
              {field.status}
            </span>
          </div>
          <div>
            <div className="text-gray-600 text-sm font-medium mb-1">Last Activity</div>
            <div className="font-semibold text-lg text-gray-800">{field.lastActivity}</div>
          </div>
          <div className="col-span-1 md:col-span-3">
            <div className="text-gray-600 text-sm font-medium mb-1">Notes</div>
            <div className="bg-gray-50 rounded p-3 text-gray-700 min-h-[48px]">{field.notes || <span className="text-gray-400">No notes</span>}</div>
          </div>
        </div>
        {/* Divider */}
        <div className="h-2 bg-gradient-to-r from-green-100 via-blue-100 to-yellow-100" />
        {/* Tasks Section */}
        <div className="px-8 py-6 bg-white/90">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📝</span>
            <h3 className="text-2xl font-bold text-gray-900">Tasks in this Field</h3>
          </div>
          {loading ? (
            <div className="text-gray-500">Loading tasks...</div>
          ) : fieldTasks.length === 0 ? (
            <div className="text-gray-400 italic">No tasks found for this field.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fieldTasks.map((task) => (
                <div
                  key={task.id}
                  className={`relative rounded-xl border border-gray-200 shadow-sm bg-white p-5 flex flex-col gap-2 hover:shadow-lg transition-shadow overflow-hidden
                    before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-2 before:rounded-l-xl before:${
                      statusColorMap[task.status]?.split(' ')[0] || 'bg-gray-200'
                    }`}
                  style={{ paddingLeft: '1.5rem' }}
                  onDoubleClick={() => handleUpdateTask(task)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColorMap[task.status] || 'bg-gray-100 text-gray-700'}`}>{task.status}</span>
                    <span className="font-semibold text-lg text-gray-800 truncate">{task.title}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Start: <span className="font-medium text-gray-700">{task.startDate || 'N/A'}</span></span>
                    <span>Due: <span className="font-medium text-gray-700">{task.dueDate || 'N/A'}</span></span>
                    {task.priority && <span>Priority: <span className="font-medium text-gray-700">{task.priority}</span></span>}
                    {task.type && <span>Type: <span className="font-medium text-gray-700">{task.type}</span></span>}
                  </div>
                  {task.description && <div className="text-gray-600 text-sm mt-1 line-clamp-3">{task.description}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Update Task Dialog */}
        {showUpdateDialog && taskToUpdate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md">
            <div className="relative w-full max-w-2xl mx-auto">
              <UpdateTaskForm
                task={taskToUpdate}
                onClose={handleCloseUpdate}
                onConfirm={handleConfirmUpdate}
                initialField={field}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldDetails; 