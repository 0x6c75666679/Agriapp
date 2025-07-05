import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus, deleteAllTasks } from '../../../api/taskApi';
import { v4 as uuidv4 } from 'uuid';

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from backend on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const taskData = await getTasks();
        setTasks(taskData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        // Use fallback tasks if API fails (without IDs - backend will assign)
        setTasks([
          { title: 'Fertilize Corn Field', status: 'Planned', priority: 'medium', type: 'fertilization', description: 'Apply NPK fertilizer', startDate: 'May 20, 2024', startTime: '08:00 AM', dueDate: 'May 21, 2024', dueTime: '05:00 PM', field: 'Corn Plot' },
          { title: 'Plant New Seeds', status: 'Planned', priority: 'high', type: 'watering', description: 'Plant tomato seeds in greenhouse', startDate: 'May 24, 2024', startTime: '09:00 AM', dueDate: 'May 25, 2024', dueTime: '04:00 PM', field: 'Tomato Patch' },
          { title: 'Water Tomato Field', status: 'Started', priority: 'high', type: 'watering', description: 'Use drip irrigation only', startDate: 'May 20, 2024', startTime: '09:00 AM', dueDate: 'May 21, 2024', dueTime: '17:00 PM', field: 'Tomato Patch' },
          { title: 'Check Soil pH', status: 'Started', priority: 'low', type: 'monitoring', description: 'Test soil acidity levels', startDate: 'May 21, 2024', startTime: '10:00 AM', dueDate: 'May 22, 2024', dueTime: '11:00 AM', field: 'North Field' },
          { title: 'Weed North Field', status: 'In-Progress', priority: 'low', type: 'weeding', description: 'Remove visible weeds', startDate: 'May 21, 2024', startTime: '08:00 AM', dueDate: 'May 22, 2024', dueTime: '11:00 AM', field: 'North Field' },
          { title: 'Harvest Tomatoes', status: 'Completed', priority: 'high', type: 'harvesting', description: 'Pick ripe tomatoes', startDate: 'May 22, 2024', startTime: '06:00 AM', dueDate: 'May 23, 2024', dueTime: '12:00 PM', field: 'Tomato Patch' },
          { title: 'Prepare Storage', status: 'Completed', priority: 'medium', type: 'storage', description: 'Clean and organize storage area', startDate: 'May 23, 2024', startTime: '09:00 AM', dueDate: 'May 24, 2024', dueTime: '03:00 PM', field: 'Garden Plot' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (newTask) => {
    console.log('useTaskManagement - addTask called with:', newTask);
    try {
      console.log('useTaskManagement - Making API call to create task...');
      const createdTask = await createTask(newTask);
      console.log('useTaskManagement - Task created successfully:', createdTask);
      setTasks(prev => [...prev, createdTask]);
      return createdTask;
    } catch (error) {
      console.error('Error creating task:', error);
      // Fallback to local creation if API fails (without ID - backend will assign)
      const taskWithId = {
        ...newTask,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      console.log('useTaskManagement - Using fallback task:', taskWithId);
      setTasks(prev => [...prev, taskWithId]);
      return taskWithId;
    }
  };

  const updateTaskById = async (taskId, updatedData) => {
    try {
      const updatedTask = await updateTask(taskId, updatedData);
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? updatedTask
            : task
        )
      );
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      // Fallback to local update if API fails
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, ...updatedData, updatedAt: new Date().toISOString() }
            : task
        )
      );
    }
  };

  const deleteTaskById = async (taskId) => {
    try {
      await deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      // Fallback to local deletion if API fails
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const deleteAllTasksById = async () => {
    try {
      await deleteAllTasks();
      setTasks([]);
    } catch (error) {
      console.error('Error deleting all tasks:', error);
      // Fallback to local deletion if API fails
      setTasks([]);
    }
  };

  const updateTaskStatusById = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
      // Fallback to local update if API fails
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
            : task
        )
      );
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask: updateTaskById,
    deleteTask: deleteTaskById,
    deleteAllTasks: deleteAllTasksById,
    updateTaskStatus: updateTaskStatusById,
  };
}; 