// Function to convert backend field data to options format
export const convertFieldsToOptions = (fields) => {
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    console.log('No fields data received from backend - no fields available');
    return [];
  }
  
  console.log('Converting fields to options:', fields);
  
  return fields.map(field => ({
    value: field.name || field.label || 'Unknown Field', // Use field name as value
    label: field.name || field.label || 'Unknown Field',
    id: field.id, // May be undefined if backend hasn't assigned yet
    area: field.area,
    crop: field.crop
  }));
};

export const categoryOptions = [
  "Watering",
  "Fertilizing", 
  "Monitoring",
  "Harvesting",
];

export const priorityOptions = ["Low", "Medium", "High"];
export const statusOptions = ["Pending", "In Progress", "Done"];

// Calculate dynamic task counts
export const getTaskTypeCount = (tasks, typeName) => {
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

// Get tasks by status
export const getTasksByStatus = (tasks, status) => {
  return tasks.filter(task => task.status === status);
};

// Get status color classes
export const getStatusColor = (status) => {
  switch (status) {
    case 'Planned': return 'bg-gray-50 border-gray-200';
    case 'Started': return 'bg-blue-50 border-blue-200';
    case 'In-Progress': return 'bg-yellow-50 border-yellow-200';
    case 'Completed': return 'bg-green-50 border-green-200';
    default: return 'bg-gray-50 border-gray-200';
  }
};

// Get status badge color classes
export const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'Planned': return 'bg-gray-200 text-gray-700';
    case 'Started': return 'bg-blue-100 text-blue-700';
    case 'In-Progress': return 'bg-yellow-100 text-yellow-700';
    case 'Completed': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-200 text-gray-700';
  }
};

// Get status margin for task cards
export const getStatusMargin = (status) => {
  switch (status) {
    case 'Started': return '-mt-4';
    case 'In-Progress': return '-mt-4';
    case 'Completed': return '-mt-4';
    default: return '';
  }
};

// Get priority badge color
export const getPriorityBadgeColor = (priority) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700';
    case 'medium': return 'bg-yellow-100 text-yellow-700';
    case 'low': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// Get type badge color
export const getTypeBadgeColor = (type) => {
  switch (type) {
    case 'irrigation': return 'bg-blue-100 text-blue-700';
    case 'fertilization': return 'bg-green-100 text-green-700';
    case 'monitoring': return 'bg-yellow-100 text-yellow-700';
    case 'harvesting': return 'bg-purple-100 text-purple-700';
    case 'weeding': return 'bg-yellow-100 text-yellow-700';
    case 'sowing': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

// Format date safely
export const formatDate = (dateString) => {
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
export const formatTime = (timeString) => {
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
export const formatDateTime = (dateString, timeString) => {
  const formattedDate = formatDate(dateString);
  const formattedTime = formatTime(timeString);
  
  if (formattedDate === 'Not set' || formattedDate === 'Invalid date') {
    return formattedDate;
  }
  
  return formattedTime ? `${formattedDate} ${formattedTime}` : formattedDate;
}; 