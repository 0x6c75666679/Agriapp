// Simple event emitter for task refresh notifications
class TaskEventEmitter {
  constructor() {
    this.listeners = [];
  }

  // Subscribe to task refresh events
  subscribe(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Emit task refresh event to all listeners
  emit() {
    this.listeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Error in task refresh listener:', error);
      }
    });
  }
}

// Create a singleton instance
export const taskEventEmitter = new TaskEventEmitter(); 