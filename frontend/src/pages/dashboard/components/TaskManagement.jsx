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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Task Management</h3>
          <p className="text-xs text-gray-600">Organize and track your farming activities</p>
        </div>
        <button className="bg-[#34A853] hover:bg-[#22C55E] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          View All Tasks
        </button>
      </div>

      {/* Task Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-blue-800">Irrigation</h4>
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
              {tasks.filter(t => t.type === 'irrigation' && !t.completed).length}
            </span>
          </div>
          <p className="text-xs text-blue-600">Water management tasks</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-green-800">Fertilization</h4>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
              {tasks.filter(t => t.type === 'fertilization' && !t.completed).length}
            </span>
          </div>
          <p className="text-xs text-green-600">Nutrient application</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-yellow-800">Monitoring</h4>
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">
              {tasks.filter(t => t.type === 'monitoring' && !t.completed).length}
            </span>
          </div>
          <p className="text-xs text-yellow-600">Pest and health checks</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-purple-800">Harvesting</h4>
            <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
              {tasks.filter(t => t.type === 'harvesting' && !t.completed).length}
            </span>
          </div>
          <p className="text-xs text-purple-600">Crop collection tasks</p>
        </div>
      </div>

      {/* Detailed Task List */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800 mb-3">Important Tasks</h4>
        {tasks
          .filter(task => task.priority === 'high')
          .slice(0, 2)
          .map(task => (
            <div key={task.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div 
                className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                  task.completed ? 'bg-[#34A853] border-[#34A853]' : 'border-gray-300'
                }`}
                onClick={() => handleTaskToggle(task.id)}
              >
                {task.completed && <span className="text-white text-xs">✓</span>}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {task.title}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.type === 'irrigation' ? 'bg-blue-100 text-blue-700' :
                    task.type === 'fertilization' ? 'bg-green-100 text-green-700' :
                    task.type === 'monitoring' ? 'bg-yellow-100 text-yellow-700' :
                    task.type === 'harvesting' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.type}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-1">{task.description}</div>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>📍 {task.field}</span>
                  <span>🕒 {task.time}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TaskManagement; 