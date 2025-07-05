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
  "Watering",
  "Fertilizing",
  "Monitoring",
  "Harvesting",
];

const priorityOptions = ["Low", "Medium", "High"];
const statusOptions = ["Pending", "In Progress", "Done"];
const recurringOptions = ["None", "Daily", "Weekly", "Custom"];

// Format date safely
const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch (error) {
    return 'Invalid date';
  }
};

// Format time safely
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  try {
    // Handle different time formats
    if (timeString.includes(':')) {
      // If it's already in HH:MM format, just return it
      return timeString;
    }
    
    // Try to parse as Date object
    const date = new Date(`2000-01-01T${timeString}`);
    if (isNaN(date.getTime())) {
      return timeString; // Return original if can't parse
    }
    
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  } catch (error) {
    return timeString; // Return original if error
  }
};

// Format date and time together
const formatDateTime = (dateString, timeString) => {
  const formattedDate = formatDate(dateString);
  const formattedTime = formatTime(timeString);
  
  if (formattedDate === 'Not set' || formattedDate === 'Invalid date') {
    return formattedDate;
  }
  
  return formattedTime ? `${formattedDate} ${formattedTime}` : formattedDate;
};

const taskTypes = [
  {
    name: "Watering",
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

function UpdateTaskForm({ task, onClose, onConfirm }) {
  const [form, setForm] = useState({
    title: task.title || "",
    category: task.type || "",
    field: task.field || "",
    startDate: task.startDate || "",
    startTime: task.startTime || "",
    dueDate: task.dueDate || "",
    dueTime: task.dueTime || "",
    priority: task.priority || "Medium",
    notes: task.description || "",
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
    // Map form data back to task structure
    const updatedTaskData = {
      title: form.title,
      type: form.category,
      field: form.field,
      startDate: form.startDate,
      startTime: form.startTime,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      priority: form.priority.toLowerCase(),
      description: form.notes,
    };
    onConfirm(updatedTaskData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl w-full bg-white rounded-xl shadow p-6 space-y-6"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Update Task</h2>
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
        {/* Start Date & Time */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
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
        {/* Status (Read-only) */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <input
            type="text"
            value={task.status}
            className="w-full border rounded px-3 py-2 bg-gray-100"
            readOnly
            disabled
          />
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
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-2 rounded shadow"
        >
          Update Task
        </button>
      </div>
    </form>
  );
}

function TaskForm({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    category: "",
    field: "",
    startDate: "",
    startTime: "",
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
        {/* Start Date & Time */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
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
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [isDeleteAllMode, setIsDeleteAllMode] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [isUpdateTaskMode, setIsUpdateTaskMode] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState(null);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Fertilize Corn Field', status: 'Planned', priority: 'medium', type: 'fertilization', description: 'Apply NPK fertilizer', startDate: 'May 20, 2024', startTime: '08:00 AM', dueDate: 'May 21, 2024', dueTime: '05:00 PM', field: 'Corn Field' },
    { id: 2, title: 'Plant New Seeds', status: 'Planned', priority: 'high', type: 'watering', description: 'Plant tomato seeds in greenhouse', startDate: 'May 24, 2024', startTime: '09:00 AM', dueDate: 'May 25, 2024', dueTime: '04:00 PM', field: 'Greenhouse' },
    { id: 3, title: 'Water Tomato Field', status: 'Started', priority: 'high', type: 'watering', description: 'Use drip irrigation only', startDate: 'May 19, 2024', startTime: '07:00 AM', dueDate: 'May 20, 2024', dueTime: '09:00 AM', field: 'Tomato Field' },
    { id: 4, title: 'Check Soil pH', status: 'Started', priority: 'low', type: 'monitoring', description: 'Test soil acidity levels', startDate: 'May 21, 2024', startTime: '10:00 AM', dueDate: 'May 22, 2024', dueTime: '11:00 AM', field: 'North Field' },
    { id: 5, title: 'Weed North Field', status: 'In-Progress', priority: 'low', type: 'weeding', description: 'Remove visible weeds', startDate: 'May 21, 2024', startTime: '08:00 AM', dueDate: 'May 22, 2024', dueTime: '11:00 AM', field: 'North Field' },
    { id: 6, title: 'Harvest Tomatoes', status: 'Completed', priority: 'high', type: 'harvesting', description: 'Pick ripe tomatoes', startDate: 'May 22, 2024', startTime: '06:00 AM', dueDate: 'May 23, 2024', dueTime: '12:00 PM', field: 'Tomato Field' },
    { id: 7, title: 'Prepare Storage', status: 'Completed', priority: 'medium', type: 'storage', description: 'Clean and organize storage area', startDate: 'May 23, 2024', startTime: '09:00 AM', dueDate: 'May 24, 2024', dueTime: '03:00 PM', field: 'Storage' },
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

  // Calculate dynamic task counts
  const getTaskTypeCount = (typeName) => {
    const typeMapping = {
      'Watering': 'watering',
      'Fertilizing': 'fertilization', 
      'Monitoring': 'monitoring',
      'Harvesting': 'harvesting'
    };
    
    const mappedType = typeMapping[typeName];
    if (!mappedType) return 0;
    
    return tasks.filter(task => task.type === mappedType).length;
  };

  // Calculate status counts and time info
  const getStatusInfo = (status) => {
    const statusTasks = tasks.filter(task => task.status === status);
    const count = statusTasks.length;
    
    if (count === 0) {
      return { count: 0, timeRange: 'No tasks' };
    }
    
    // Get earliest start and latest due times
    const startTimes = statusTasks.map(task => new Date(`${task.startDate} ${task.startTime}`));
    const dueTimes = statusTasks.map(task => new Date(`${task.dueDate} ${task.dueTime}`));
    
    const earliestStart = new Date(Math.min(...startTimes));
    const latestDue = new Date(Math.max(...dueTimes));
    
    const formatTime = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
             ' ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };
    
    return {
      count,
      timeRange: `${formatTime(earliestStart)} - ${formatTime(latestDue)}`
    };
  };

  // Dynamic task types with real counts
  const taskTypes = [
    {
      name: "Watering",
      color: "bg-blue-50 border-blue-200 text-blue-700",
      badge: "bg-blue-100 text-blue-700",
      desc: "Water management tasks",
      count: getTaskTypeCount("Watering"),
    },
    {
      name: "Fertilizing",
      color: "bg-green-50 border-green-200 text-green-700",
      badge: "bg-green-100 text-green-700",
      desc: "Nutrient application",
      count: getTaskTypeCount("Fertilizing"),
    },
    {
      name: "Monitoring",
      color: "bg-yellow-50 border-yellow-200 text-yellow-700",
      badge: "bg-yellow-100 text-yellow-700",
      desc: "Pest and health checks",
      count: getTaskTypeCount("Monitoring"),
    },
    {
      name: "Harvesting",
      color: "bg-purple-50 border-purple-200 text-purple-700",
      badge: "bg-purple-100 text-purple-700",
      desc: "Crop collection tasks",
      count: getTaskTypeCount("Harvesting"),
    },
  ];

  // Status cards with dynamic info
  const statusCards = [
    { status: 'Planned', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
    { status: 'Started', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
    { status: 'In-Progress', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
    { status: 'Completed', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  ];

  const handleUpdateStatusClick = () => {
    console.log('Update Status button clicked!');
    console.log('Current isUpdateMode:', isUpdateMode);
    setIsUpdateMode(!isUpdateMode);
    setIsDeleteMode(false); // Exit delete mode if active
    setIsUpdateTaskMode(false); // Exit update task mode if active
    setIsDeleteAllMode(false); // Exit delete all mode if active
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

  const renderTaskCard = (task) => {
    const getStatusMargin = (status) => {
      switch (status) {
        case 'Started': return '-mt-4';
        case 'In-Progress': return '-mt-4';
        case 'Completed': return '-mt-4';
        default: return '';
      }
    };

    const getTaskCardClasses = () => {
      let baseClasses = `flex flex-col w-full h-32 p-2 border rounded-lg shadow text-left justify-center ${getStatusMargin(task.status)}`;
      
      if (isDeleteMode || isDeleteAllMode) {
        baseClasses += ' cursor-pointer border-red-400 bg-red-50 hover:bg-red-100 hover:shadow-lg transition-all duration-200';
      } else if (isUpdateTaskMode) {
        baseClasses += ' cursor-pointer border-purple-400 bg-purple-50 hover:bg-purple-100 hover:shadow-lg transition-all duration-200';
      } else if (isUpdateMode) {
        baseClasses += ' cursor-pointer active:cursor-grabbing border-indigo-400 bg-indigo-50 hover:bg-indigo-100 hover:shadow-lg transition-all duration-200';
      }
      
      if (!isDeleteMode && !isDeleteAllMode && !isUpdateTaskMode && !isUpdateMode) {
        baseClasses += ` ${getStatusColor(task.status)}`;
      }
      
      if (draggedTask?.id === task.id) {
        baseClasses += ' opacity-50';
      }
      
      return baseClasses;
    };

    return (
      <div
        key={task.id}
        className={getTaskCardClasses()}
        draggable={isUpdateMode}
        onDragStart={(e) => handleDragStart(e, task)}
        onClick={() => handleTaskClick(task)}
        role={isDeleteMode ? "button" : undefined}
        tabIndex={isDeleteMode ? 0 : undefined}
        onKeyDown={isDeleteMode ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTaskClick(task);
          }
        } : undefined}
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
          <div className="text-xs text-gray-500 mb-1">
            <div>Start: {formatDateTime(task.startDate, task.startTime)}</div>
            <div>Due: {formatDateTime(task.dueDate, task.dueTime)}</div>
          </div>
          <div className="text-xs text-gray-600">{task.description}</div>
        </div>
      </div>
    );
  };

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

  const handleDeleteTaskClick = () => {
    setIsDeleteMode(!isDeleteMode);
    setIsUpdateMode(false); // Exit update mode if active
    setIsUpdateTaskMode(false); // Exit update task mode if active
    setIsDeleteAllMode(false); // Exit delete all mode if active
  };

  const handleTaskClick = (task) => {
    if (isDeleteMode) {
      setTaskToDelete(task);
      setShowDeleteDialog(true);
    } else if (isDeleteAllMode) {
      // In delete all mode, clicking any task will trigger the delete all dialog
      setShowDeleteAllDialog(true);
    } else if (isUpdateTaskMode) {
      handleTaskUpdateClick(task);
    }
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskToDelete.id));
      setTaskToDelete(null);
      setShowDeleteDialog(false);
      setIsDeleteMode(false);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setShowDeleteDialog(false);
    setIsDeleteMode(false);
  };

  const handleDeleteAllClick = () => {
    setIsDeleteAllMode(true);
    setIsDeleteMode(false); // Exit individual delete mode if active
    setIsUpdateMode(false); // Exit update mode if active
    setIsUpdateTaskMode(false); // Exit update task mode if active
    
    // After 0.5 seconds, show the confirmation dialog
    setTimeout(() => {
      setShowDeleteAllDialog(true);
    }, 300);
  };

  const handleConfirmDeleteAll = () => {
    setTasks([]); // Delete all tasks
    setShowDeleteAllDialog(false);
    setIsDeleteAllMode(false);
  };

  const handleCancelDeleteAll = () => {
    setShowDeleteAllDialog(false);
    setIsDeleteAllMode(false);
  };

  const handleUpdateTaskClick = () => {
    setIsUpdateTaskMode(!isUpdateTaskMode);
    setIsDeleteMode(false); // Exit delete mode if active
    setIsDeleteAllMode(false); // Exit delete all mode if active
    setIsUpdateMode(false); // Exit update status mode if active
  };

  const handleTaskUpdateClick = (task) => {
    if (isUpdateTaskMode) {
      setTaskToUpdate(task);
      setShowUpdateDialog(true);
    }
  };

  const handleConfirmUpdate = (updatedTaskData) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskToUpdate.id 
          ? { ...task, ...updatedTaskData }
          : task
      )
    );
    setTaskToUpdate(null);
    setShowUpdateDialog(false);
    setIsUpdateTaskMode(false);
  };

  const handleCancelUpdate = () => {
    setTaskToUpdate(null);
    setShowUpdateDialog(false);
    setIsUpdateTaskMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className={`h-screen ${showDeleteDialog || showDeleteAllDialog || showUpdateDialog || showModal ? 'blur-sm' : ''}`}>
        <Sidebar sidebarCollapsed={sidebarCollapsed} sidebarItems={sidebarItems} />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className={`${showDeleteDialog || showDeleteAllDialog || showUpdateDialog || showModal ? 'blur-sm' : ''}`}>
          <Header sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} title={"Task-Manager"}/>
        </div>
        <div className={`p-6 ${showDeleteDialog || showDeleteAllDialog || showUpdateDialog || showModal ? 'blur-sm' : ''}`}>
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
              {/* Dynamic Status Cards */}
              {statusCards.map((card) => {
                const info = getStatusInfo(card.status);
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
                  onClick={handleDeleteTaskClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleDeleteTaskClick();
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
              {renderStatusRow('Planned')}
              {renderStatusRow('Started')}
              {renderStatusRow('In-Progress')}
              {renderStatusRow('Completed')}

              {/* Action buttons row */}
              <div className="flex gap-4 w-full -mt-4">
                <div 
                  className={`flex-1 border-2 border-gray-300 rounded-lg h-23 flex items-center justify-center cursor-pointer transition-colors hover:shadow-md ${isUpdateTaskMode ? 'bg-purple-200 border-purple-400' : 'bg-purple-100 hover:bg-purple-200'}`}
                  onClick={handleUpdateTaskClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleUpdateTaskClick();
                    }
                  }}
                >
                  <span className={`font-semibold text-lg ${isUpdateTaskMode ? 'text-purple-800' : 'text-purple-700'}`}>
                    {isUpdateTaskMode ? 'Exit Update Mode' : 'Update Task'}
                  </span>
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
                <div 
                  className={`flex-1 border-2 border-gray-300 rounded-lg h-23 flex items-center justify-center cursor-pointer transition-colors hover:shadow-md ${isDeleteAllMode ? 'bg-red-200 border-red-400' : 'bg-red-100 hover:bg-red-200'}`}
                  onClick={handleDeleteAllClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleDeleteAllClick();
                    }
                  }}
                >
                  <span className={`font-semibold text-lg ${isDeleteAllMode ? 'text-red-800' : 'text-red-700'}`}>
                    {isDeleteAllMode ? 'Deleting...' : 'Delete All'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-2xl mx-auto">
              <TaskForm onClose={() => setShowModal(false)} />
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && taskToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Delete Task
                </h3>
                <p className="text-gray-600 mb-6">
                  Do you want to delete the task "{taskToDelete.title}"?
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    No
                  </button>
                  <button
                    onClick={handleConfirmDelete}
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
                    onClick={handleCancelDeleteAll}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    No
                  </button>
                  <button
                    onClick={handleConfirmDeleteAll}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Update Task Dialog */}
        {showUpdateDialog && taskToUpdate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-2xl mx-auto">
              <UpdateTaskForm 
                task={taskToUpdate}
                onClose={handleCancelUpdate}
                onConfirm={handleConfirmUpdate}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Taskboard;
