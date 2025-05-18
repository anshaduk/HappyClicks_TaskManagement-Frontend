import api from './api';

const taskService = {
  getAllTasks: async (filters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.status) {
      params.append('status', filters.status);
    }
    
    if (filters.priority) {
      params.append('priority', filters.priority);
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    const url = `/tasks/${params.toString() ? '?' + params.toString() : ''}`;
    const response = await api.get(url);
    return response.data;
  },
  
  getTaskById: async (id) => {
    const response = await api.get(`/tasks/${id}/`);
    return response.data;
  },
  
  createTask: async (taskData) => {
    const response = await api.post('/tasks/', taskData);
    return response.data;
  },
  
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}/`, taskData);
    return response.data;
  },
  
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}/`);
    return response.data;
  },
  
  getTaskStats: async () => {
    const response = await api.get('/task-stats/');
    return response.data;
  }
};

export default taskService;