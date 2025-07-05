import React, { useState, useEffect } from "react";
import { 
  categoryOptions, 
  priorityOptions, 
  convertFieldsToOptions
} from "../utils/taskUtils";
import { getFields } from "../../../api/fieldApi";

const UpdateTaskForm = ({ task, onClose, onConfirm }) => {
  console.log('UpdateTaskForm - received task:', task);
  
  const [form, setForm] = useState({
    title: "",
    category: "",
    field: "",
    startDate: "",
    startTime: "",
    dueDate: "",
    dueTime: "",
    priority: "",
    notes: "",
    status: "",
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
        console.log('UpdateTaskForm - loaded fields:', fieldOptions);
      } catch (error) {
        console.error('Error fetching fields:', error);
        // Keep using fallback fields
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  // Update form when task prop changes or when fields are loaded
  useEffect(() => {
    if (task) {
      console.log('UpdateTaskForm - updating form with task data:', task);
      console.log('UpdateTaskForm - available fields:', fields);
      
      // Find the matching field option for the task's field ID
      let fieldValue = "";
      if (fields.length > 0) {
        // First try to match by field ID (task.fieldId or task.field.id)
        const fieldId = task.fieldId || task.field?.id || task.field;
        console.log('UpdateTaskForm - looking for field with ID:', fieldId);
        
        const matchingField = fields.find(f => {
          // Match by field ID
          const idMatch = f.id === fieldId;
          // Also try matching by name as fallback (for backward compatibility)
          const nameMatch = f.label === task.field || f.value === task.field;
          const nameLowerMatch = f.label.toLowerCase() === task.field?.toLowerCase() || f.value.toLowerCase() === task.field?.toLowerCase();
          
          console.log('UpdateTaskForm - checking field:', f.label, 'ID:', f.id, 'against fieldId:', fieldId);
          console.log('UpdateTaskForm - matches:', { idMatch, nameMatch, nameLowerMatch });
          
          return idMatch || nameMatch || nameLowerMatch;
        });
        
        fieldValue = matchingField ? matchingField.value : "";
        console.log('UpdateTaskForm - matching field found:', matchingField);
        console.log('UpdateTaskForm - field value to use:', fieldValue);
      } else {
        // If fields haven't loaded yet, just use empty string
        fieldValue = "";
        console.log('UpdateTaskForm - fields not loaded yet, field value will be set later');
      }
      
      // Map task category to frontend category options
      let categoryValue = task.category || "";
      console.log('UpdateTaskForm - original task category:', categoryValue);
      
      if (categoryValue) {
        // Convert backend category names to frontend category names
        const categoryMapping = {
          'watering': 'Watering',
          'fertilization': 'Fertilizing',
          'monitoring': 'Monitoring',
          'harvesting': 'Harvesting'
        };
        categoryValue = categoryMapping[categoryValue.toLowerCase()] || categoryValue;
        console.log('UpdateTaskForm - mapped category value:', categoryValue);
      }
      
      // Map task priority to frontend priority options
      let priorityValue = task.priority || "";
      console.log('UpdateTaskForm - original task priority:', priorityValue);
      
      if (priorityValue) {
        // Convert backend priority names to frontend priority names
        const priorityMapping = {
          'high': 'High',
          'medium': 'Medium',
          'low': 'Low'
        };
        priorityValue = priorityMapping[priorityValue.toLowerCase()] || priorityValue;
        console.log('UpdateTaskForm - mapped priority value:', priorityValue);
      } else {
        priorityValue = "Medium"; // Default value
      }
      
      // Format dates if they're in a different format
      const formatDateForInput = (dateStr) => {
        if (!dateStr) return "";
        try {
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) return dateStr;
          return date.toISOString().split('T')[0];
        } catch (error) {
          return dateStr;
        }
      };
      
      console.log('UpdateTaskForm - setting form with:', {
        title: task.title,
        category: categoryValue,
        field: fieldValue,
        startDate: formatDateForInput(task.startDate),
        startTime: task.startTime,
        dueDate: formatDateForInput(task.dueDate),
        dueTime: task.dueTime,
        priority: priorityValue,
        notes: task.description,
        status: task.status
      });
      
      setForm({
        title: task.title || "",
        category: categoryValue,
        field: fieldValue,
        startDate: formatDateForInput(task.startDate),
        startTime: task.startTime || "",
        dueDate: formatDateForInput(task.dueDate),
        dueTime: task.dueTime || "",
        priority: priorityValue,
        notes: task.description || "",
        status: task.status || "",
      });
    }
  }, [task, fields]);

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
    
    // Map form data back to task structure
    const updatedTaskData = {
      title: form.title,
      type: form.category.toLowerCase(),
      fieldId: selectedField?.id || null, // Send field ID
      fieldName: selectedField?.label || form.field, // Send field name as fallback
      startDate: form.startDate,
      startTime: form.startTime,
      dueDate: form.dueDate,
      dueTime: form.dueTime,
      priority: form.priority.toLowerCase(),
      description: form.notes,
      status: form.status, // Preserve the current status
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
            disabled={loading || fields.length === 0}
          >
            <option value="">
              {loading ? 'Loading fields...' : 
               fields.length === 0 ? 'No fields available' : 'Select field'}
            </option>
            {fields.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label} {f.area && `(area: ${f.area})`} {f.crop && `- ${f.crop}`}
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
            placeholder="Select priority"
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
};

export default UpdateTaskForm; 