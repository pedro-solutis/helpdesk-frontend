import api from './api';

export const authService = {
  login: async (email, password) => {
    // POST /login
    const response = await api.post('/login', { email, password });
    return response.data;
  }
};

