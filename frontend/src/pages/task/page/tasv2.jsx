import React, { useState } from "react";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { Toaster } from "react-hot-toast";

const fieldOptions = [
  { value: "north_field", label: "North Field" },
  { value: "tomato_patch", label: "Tomato Patch" },
  { value: "corn_plot", label: "Corn Plot" },
];

const categoryOptions = [
  "Sowing",
  "Watering",
  "Fertilizing",
  "Harvesting",
  "Weeding",
  "Pest Control",
  "Other",
];

const priorityOptions = ["Low", "Medium", "High"];
const statusOptions = ["Pending", "In Progress", "Done"];
const recurringOptions = ["None", "Daily", "Weekly", "Custom"];

const taskTypes = [
  {
    name: "Irrigation",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    badge: "bg-blue-100 text-blue-700",
    desc: "Water management tasks",
    count: 0,
  },
  {
    name: "Fertilization",
    color: "bg-green-50 border-green-200 text-green-700",
    badge: "bg-green-100 text-green-700",
    desc: "Nutrient application",
    count: 0,
  },
  {
    name: "Monitoring",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    badge: "bg-yellow-100 text-yellow-700",
    desc: "Pest and health checks",
    count: 0,
  },
  {
    name: "Harvesting",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    badge: "bg-purple-100 text-purple-700",
    desc: "Crop collection tasks",
    count: 0,
  },
];

function TaskForm({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    field: "",
    dueDate: "",
    dueTime: "",
    priority: "Medium",
    status: "Pending",
    notes: "",
    reminders: false,
    recurring: "None",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle form submission (API call or state update)
    alert("Task submitted! (Demo)");
    if (onClose) onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl w-full bg-white rounded-xl shadow p-6 space-y-6"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Create / Edit Task</h2>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl font-bold">×</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Task Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="e.g., Water Tomato Field"
            required
          />
        </div>
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select category</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {/* Field */}
        <div>
          <label className="block text-sm font-medium mb-1">Field</label>
          <select
            name="field"
            value={form.field}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Select field</option>
            {fieldOptions.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
        {/* Due Date & Time */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Due Time</label>
            <input
              type="time"
              name="dueTime"
              value={form.dueTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>
        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            {priorityOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        {/* Reminders */}
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            name="reminders"
            checked={form.reminders}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm">Enable push/email reminders</label>
        </div>
        {/* Recurring Task Option */}
        <div>
          <label className="block text-sm font-medium mb-1">Recurring</label>
          <select
            name="recurring"
            value={form.recurring}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            {recurringOptions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={3}
          placeholder="Optional remarks or instructions (e.g., use drip irrigation only)"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          Save Task
        </button>
      </div>
    </form>
  );
}

function Taskboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Fertilize Corn Field', status: 'Planned', priority: 'medium', type: 'fertilization', description: 'Apply NPK fertilizer', dueDate: 'May 21, 2024', field: 'Corn Field' },
    { id: 2, title: 'Plant New Seeds', status: 'Planned', priority: 'high', type: 'sowing', description: 'Plant tomato seeds in greenhouse', dueDate: 'May 25, 2024', field: 'Greenhouse' },
    { id: 3, title: 'Water Tomato Field', status: 'Started', priority: 'high', type: 'irrigation', description: 'Use drip irrigation only', dueDate: 'May 20, 2024', field: 'Tomato Field' },
    { id: 4, title: 'Check Soil pH', status: 'Started', priority: 'low', type: 'monitoring', description: 'Test soil acidity levels', dueDate: 'May 22, 2024', field: 'North Field' },
    { id: 5, title: 'Weed North Field', status: 'In-Progress', priority: 'low', type: 'weeding', description: 'Remove visible weeds', dueDate: 'May 22, 2024', field: 'North Field' },
    { id: 6, title: 'Harvest Tomatoes', status: 'Completed', priority: 'high', type: 'harvesting', description: 'Pick ripe tomatoes', dueDate: 'May 23, 2024', field: 'Tomato Field' },
    { id: 7, title: 'Prepare Storage', status: 'Completed', priority: 'medium', type: 'storage', description: 'Clean and organize storage area', dueDate: 'May 24, 2024', field: 'Storage' },
  ]);

  const sidebarItems = [
    { label: 'Home' },
    { label: 'Rentals' },
    { label: 'Reports' },
    { label: 'Soil Testing' },
    { label: 'Marketplace' },
    { label: 'Community' },
    { label: 'Profile' },
  ];

  const handleUpdateStatusClick = () => {
    console.log('Update Status button clicked!');
    console.log('Current isUpdateMode:', isUpdateMode);
    setIsUpdateMode(!isUpdateMode);
    console.log('New isUpdateMode will be:', !isUpdateMode);
  };

  const handleDragStart = (e, task) => {
    if (!isUpdateMode) return;
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    if (!isUpdateMode) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    if (!isUpdateMode || !draggedTask) return;
    e.preventDefault();
    
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: newStatus }
          : task
      )
    );
    setDraggedTask(null);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Planned': return 'bg-gray-50 border-gray-200';
      case 'Started': return 'bg-blue-50 border-blue-200';
      case 'In-Progress': return 'bg-yellow-50 border-yellow-200';
      case 'Completed': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Planned': return 'bg-gray-200 text-gray-700';
      case 'Started': return 'bg-blue-100 text-blue-700';
      case 'In-Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const renderTaskCard = (task) => (
    <div
      key={task.id}
      className={`flex flex-col w-full h-32 p-2 ${getStatusColor(task.status)} border rounded-lg shadow text-left justify-center ${isUpdateMode ? 'cursor-grab active:cursor-grabbing' : ''} ${draggedTask?.id === task.id ? 'opacity-50' : ''}`}
      draggable={isUpdateMode}
      onDragStart={(e) => handleDragStart(e, task)}
    >
      <div className="ml-2">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="font-semibold text-gray-800 text-base">{task.title}</h3>
          <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-700' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
            {task.priority}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${task.type === 'irrigation' ? 'bg-blue-100 text-blue-700' : task.type === 'fertilization' ? 'bg-green-100 text-green-700' : task.type === 'monitoring' ? 'bg-yellow-100 text-yellow-700' : task.type === 'harvesting' ? 'bg-purple-100 text-purple-700' : task.type === 'weeding' ? 'bg-yellow-100 text-yellow-700' : task.type === 'sowing' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
            {task.type}
          </span>
        </div>
        <div className="mb-1">
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(task.status)}`}>
            {task.status}
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-1">Due: {task.dueDate}</div>
        <div className="text-xs text-gray-600">{task.description}</div>
      </div>
    </div>
  );

  const renderStatusRow = (status) => {
    const statusTasks = getTasksByStatus(status);
    
    return (
      <div 
        key={status}
        className="flex gap-4 mb-4"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        {statusTasks.length > 0 ? (
          statusTasks.map(renderTaskCard)
        ) : (
          <div className="flex flex-col w-full h-32 p-2 bg-gray-50 border border-gray-200 rounded-lg shadow text-left justify-center -mt-4">
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

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar sidebarCollapsed={sidebarCollapsed} sidebarItems={sidebarItems} />
      <div className="flex-1 overflow-hidden">
        <Header sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} title={"Task-Manager"}/>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-stretch">
            {/* Left column: Create Task + state buttons */}
            <div className="flex flex-col h-full w-full gap-4">
              {/* 1. Create Task card */}
              <div className="relative h-32 w-full">
                <div className="h-full w-full border rounded-lg p-4 flex flex-col justify-center items-center bg-white">
                  <button
                    onClick={() => setShowModal(true)}
                    className="text-green-700 font-semibold text-lg flex items-center justify-center focus:outline-none"
                    style={{ width: '100%', height: '100%' }}
                  >
                    + Create Task
                  </button>
                </div>
              </div>
              {/* 2. Pending card */}
              <div className="relative h-32 w-full">
                <div className="h-full w-full border rounded-lg p-4 flex flex-col justify-center items-center bg-gray-100">
                  <span className="text-gray-700 font-semibold text-lg">Planned</span>
                </div>
              </div>
              {/* 3. In Progress card */}
              <div className="relative h-32 w-full">
                <div className="h-full w-full border rounded-lg p-4 flex flex-col justify-center items-center bg-blue-100">
                  <span className="text-blue-700 font-semibold text-lg">Started</span>
                </div>
              </div>
              {/* 4. Started card */}
              <div className="relative h-32 w-full">
                <div className="h-full w-full border rounded-lg p-4 flex flex-col justify-center items-center bg-yellow-100">
                  <span className="text-yellow-700 font-semibold text-lg">In-Progress</span>
                </div>
              </div>
              {/* 5. Completed card */}
              <div className="relative h-32 w-full">
                <div className="h-full w-full border rounded-lg p-4 flex flex-col justify-center items-center bg-green-100">
                  <span className="text-green-700 font-semibold text-lg">Completed</span>
                </div>
              </div>
              {/* 6. Delete Task button (original position) */}
              <div className="relative h-23 w-full">
                <div className="h-full w-full border rounded-lg p-4 flex flex-col justify-center items-center bg-red-100">
                  <span className="text-red-700 font-semibold text-lg">Delete Task</span>
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
              {renderStatusRow('Planned')}
              {renderStatusRow('Started')}
              {renderStatusRow('In-Progress')}
              {renderStatusRow('Completed')}

              {/* Action buttons row */}
              <div className="flex gap-4 w-full -mt-4">
                <div className="flex-1 border-2 border-gray-300 rounded-lg h-23 flex items-center justify-center bg-orange-100">
                  <span className="text-orange-700 font-semibold text-lg">Update Task</span>
                </div>
                <div 
                  className={`flex-1 border-2 border-gray-300 rounded-lg h-23 flex items-center justify-center cursor-pointer transition-colors hover:shadow-md ${isUpdateMode ? 'bg-blue-200 border-blue-400' : 'bg-blue-100 hover:bg-blue-200'}`}
                  onClick={handleUpdateStatusClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleUpdateStatusClick();
                    }
                  }}
                >
                  <span className={`font-semibold text-lg ${isUpdateMode ? 'text-blue-800' : 'text-blue-700'}`}>
                    {isUpdateMode ? 'Exit Update Mode' : 'Update Status'}
                  </span>
                </div>
                <div className="flex-1 border-2 border-gray-300 rounded-lg h-23 flex items-center justify-center bg-red-100">
                  <span className="text-red-700 font-semibold text-lg">Delete All</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative w-full max-w-2xl mx-auto">
              <TaskForm onClose={() => setShowModal(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Taskboard;
