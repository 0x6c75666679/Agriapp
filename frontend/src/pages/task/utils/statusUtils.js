// Calculate status counts only
export const getStatusInfo = (tasks, status) => {
  console.log('getStatusInfo called with:', { tasks: tasks?.length, status });
  const statusTasks = tasks.filter(task => task.status === status);
  const count = statusTasks.length;
  
  console.log('getStatusInfo returning:', { count });
  return { count };
};

// Status cards configuration
export const statusCards = [
  { status: 'Planned', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
  { status: 'Started', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  { status: 'In-Progress', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  { status: 'Completed', bgColor: 'bg-green-100', textColor: 'text-green-700' },
];

// Task types configuration
export const getTaskTypes = (tasks) => [
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