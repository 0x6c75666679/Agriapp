import React, { useState, useEffect } from "react";
import { 
  categoryOptions, 
  priorityOptions, 
  convertFieldsToOptions
} from "../utils/taskUtils";
import { getFields } from "../../../api/fieldApi";

const TaskForm = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    field: "",
    startDate: "",
    startTime: "",
    dueDate: "",
    dueTime: "",
    priority: "Medium",
    notes: "",
  });
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch fields from backend on component mount
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);
        const fieldData = await getFields();
        const fieldOptions = convertFieldsToOptions(fieldData);
        setFields(fieldOptions);
      } catch (error) {
        console.error('Error fetching fields:', error);
        // Keep using fallback fields
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find the selected field to get additional info
    const selectedField = fields.find(f => f.value === form.field);
    
    // Map form data to task structure
    const newTask = {
      title: form.title,
      type: form.category,
      fieldName: selectedField?.label || form.field, // Send field name
      startDate: form.startDate,
      startTime: form.startTime,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      priority: form.priority.toLowerCase(),
      status: "Planned", // New tasks are always in Planned stage
      description: form.notes,
    };
    
    console.log('TaskForm - Submitting new task:', newTask);
    console.log('TaskForm - Selected field:', selectedField);
    console.log('TaskForm - Form data:', form);
    
    onSubmit(newTask);
    onClose();
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
            disabled={loading || fields.length === 0}
          >
            <option value="">
              {loading ? 'Loading fields...' : 
               fields.length === 0 ? 'No fields available' : 'Select field'}
            </option>
            {fields.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label} {f.area && `(${f.area})`} {f.crop && `- ${f.crop}`}
              </option>
            ))}
          </select>
          {!loading && fields.length === 0 && (
            <p className="text-sm text-red-500 mt-1">
              No fields found. Please create fields first.
            </p>
          )}
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
};

export default TaskForm; 