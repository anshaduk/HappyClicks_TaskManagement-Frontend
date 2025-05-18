import api from './api';

const authService = {
  register: async (username, email, password) => {
    const response = await api.post('/register/', {
      username,
      email,
      password
    });
    return response.data;
  },
  
  login: async (username, password) => {
    const response = await api.post('/token/', {
      username,
      password
    });
    
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
  },
  
  getCurrentUser: () => {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  }
};

export default authService;