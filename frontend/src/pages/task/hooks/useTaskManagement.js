import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask, updateTaskStatus, deleteAllTasks } from '../../../api/taskApi';
import { v4 as uuidv4 } from 'uuid';
import { taskEventEmitter } from '../../../utils/taskEventEmitter';

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
        // Show only one important task when API fails, or empty array if no tasks
        setTasks([
          { id: 'fallback-1', title: 'Water Tomato Field', status: 'Started', priority: 'high', type: 'watering', description: 'Use drip irrigation only', startDate: 'May 20, 2024', startTime: '09:00 AM', dueDate: 'May 21, 2024', dueTime: '17:00 PM', field: 'Tomato Patch' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // Subscribe to task refresh events
    const unsubscribe = taskEventEmitter.subscribe(() => {
      console.log('Task refresh event received, refreshing tasks...');
      fetchTasks();
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const addTask = async (newTask) => {
    console.log('useTaskManagement - addTask called with:', newTask);
    try {
      console.log('useTaskManagement - Making API call to create task...');
      await createTask(newTask);
      // Fetch all tasks after creation to ensure state is in sync
      const allTasks = await getTasks();
      setTasks(allTasks);
      return true;
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
      return false;
    }
  };

  const updateTaskById = async (taskId, updatedData) => {
    try {
      await updateTask(taskId, updatedData);
      // Fetch all tasks after update to ensure state is in sync
      const allTasks = await getTasks();
      setTasks(allTasks);
      return true;
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
      return false;
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