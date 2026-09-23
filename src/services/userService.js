import api from './api';

export const userService = {
  // GET /users
  getUsers: async (page = 0, size = 10, filters = {}) => {
    const response = await api.get('/users', { params: { page, size, ...filters } });
    return response.data;
  },

  // GET /users/{id}
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // GET /users?role=TECHNICIAN
  getByTechnicians: async (page = 0, size = 10) => {
    const response = await api.get('/users', { params: { page, size, role: 'TECHNICIAN' }});
    return response.data;
  },

  // POST /users
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // PUT /users/{id}
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // DELETE /users/{id}
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};

