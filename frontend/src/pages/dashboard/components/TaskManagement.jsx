import React from 'react';
import toast from 'react-hot-toast';

const TaskManagement = ({ tasks, setTasks }) => {
  const handleTaskToggle = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    const task = tasks.find(t => t.id === taskId);
    const isCompleted = !task.completed;

    if (isCompleted) {
      toast.success(`✅ Task completed: ${task.title}`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    } else {
      toast('🔄 Task marked as incomplete', {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#6B7280',
          color: '#fff',
          borderRadius: '8px',
          padding: '12px 16px',
        },
      });
    }

    setTasks(updatedTasks);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Task Management</h2>
          <p className="text-xs text-gray-600 mt-1">Organize and track your farming activities</p>
        </div>
        <button className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors">
          View All Tasks
        </button>
      </div>

             {/* Task Categories */}
       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
         {[
           {
             name: 'Irrigation',
             color: 'blue',
             desc: 'Water management tasks',
             type: 'irrigation',
           },
           {
             name: 'Fertilization',
             color: 'green',
             desc: 'Nutrient application',
             type: 'fertilization',
           },
           {
             name: 'Monitoring',
             color: 'yellow',
             desc: 'Pest and health checks',
             type: 'monitoring',
           },
           {
             name: 'Harvesting',
             color: 'purple',
             desc: 'Crop collection tasks',
             type: 'harvesting',
           },
         ].map((cat) => (
           <div key={cat.name} className={`bg-${cat.color}-50 border border-${cat.color}-200 rounded-xl p-3`}>
             <div className="flex items-center justify-between mb-1">
               <h4 className={`font-medium text-${cat.color}-800 text-sm`}>{cat.name}</h4>
               <span className={`bg-${cat.color}-100 text-${cat.color}-700 text-xs px-2 py-1 rounded-full`}>
                 {tasks.filter(t => t.type === cat.type && !t.completed).length}
               </span>
             </div>
             <p className={`text-xs text-${cat.color}-600`}>{cat.desc}</p>
           </div>
         ))}
       </div>

             {/* Single Task Display */}
       {tasks.length > 0 && (
         <div className="mt-3">
           <div className="flex flex-col w-full h-36 p-3 border rounded-lg shadow text-left justify-center bg-white">
             <div className="ml-2">
               <div className="flex items-center space-x-2 mb-1">
                 <h3 className="font-semibold text-gray-800 text-base">{tasks[0].title}</h3>
                 <span className={`text-xs px-2 py-1 rounded-full ${
                   tasks[0].priority === 'high' ? 'bg-red-100 text-red-700' :
                   tasks[0].priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                   'bg-blue-100 text-blue-700'
                 }`}>
                   {tasks[0].priority}
                 </span>
                 <span className={`text-xs px-2 py-1 rounded-full ${
                   tasks[0].type === 'irrigation' ? 'bg-blue-100 text-blue-700' :
                   tasks[0].type === 'fertilization' ? 'bg-green-100 text-green-700' :
                   tasks[0].type === 'monitoring' ? 'bg-yellow-100 text-yellow-700' :
                   tasks[0].type === 'harvesting' ? 'bg-purple-100 text-purple-700' :
                   'bg-gray-100 text-gray-700'
                 }`}>
                   {tasks[0].type}
                 </span>
               </div>
               <div className="mb-1">
                 <span className={`text-xs px-2 py-1 rounded-full ${
                   tasks[0].status === 'Planned' ? 'bg-gray-100 text-gray-700' :
                   tasks[0].status === 'Started' ? 'bg-blue-100 text-blue-700' :
                   tasks[0].status === 'In-Progress' ? 'bg-yellow-100 text-yellow-700' :
                   tasks[0].status === 'Completed' ? 'bg-green-100 text-green-700' :
                   'bg-gray-100 text-gray-700'
                 }`}>
                   {tasks[0].status}
                 </span>
               </div>
               <div className="text-xs text-gray-500 mb-1">
                 <div>Start: {tasks[0].startDate} {tasks[0].startTime}</div>
                 <div>Due: {tasks[0].dueDate} {tasks[0].dueTime}</div>
               </div>
               <div className="text-xs text-gray-600">{tasks[0].description}</div>
             </div>
           </div>
         </div>
       )}
    </div>
  );
};

export default TaskManagement;
