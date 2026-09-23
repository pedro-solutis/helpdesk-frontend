import api from './api';

export const ticketService = {
  // GET /tickets/dashboard
  getDashboardMetrics: async () => {
    const response = await api.get('/tickets/dashboard');
    return response.data;
  },

  // GET /tickets
  getTickets: async (page = 0, size = 10, filters = {}) => {
    const params = { page, size, ...filters };
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '' || params[key] === undefined) {
        delete params[key];
      }
    });
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  // GET /tickets/{id}
  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // POST /tickets
  createTicket: async (ticketData) => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
  },

  // PUT /tickets/{id}
  updateTicket: async (id, ticketData) => {
    const response = await api.put(`/tickets/${id}`, ticketData);
    return response.data;
  },

  // PATCH /tickets/technician/{id}
  assignTechnician: async (id, technicianId) => {
    const response = await api.patch(`/tickets/technician/${id}`, { technicianId });
    return response.data;
  },

  // PATCH /tickets/{id}
  closeTicket: async (id) => {
    const response = await api.patch(`/tickets/${id}`);
    return response.data;
  },

  // DELETE /tickets/{id}
  deleteTicket: async (id) => {
    const response = await api.delete(`/tickets/${id}`);
    return response.data;
  }
};

