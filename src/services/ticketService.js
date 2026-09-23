import api from './api';

export const ticketService = {
  // GET /tickets/dashboard
  getDashboardMetrics: async () => {
    const response = await api.get('/tickets/dashboard');
    return response.data;
  },

  // GET /tickets
  getTickets: async (page = 0, size = 10) => {
    const response = await api.get('/tickets', {
      params: { page, size }
    });
    return response.data;
  },

  // GET /tickets/search?title=...
  searchTickets: async (title, page = 0, size = 10) => {
    const response = await api.get('/tickets/search', {
      params: { title, page, size }
    });
    return response.data;
  },

  // GET /tickets/filter?status=...&priority=...
  filterTickets: async (filters, page = 0, size = 10) => {
    const params = { page, size, ...filters };
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '' || params[key] === undefined) {
        delete params[key];
      }
    });
    
    const response = await api.get('/tickets/filter', { params });
    return response.data;
  },

  // GET /tickets/{id}
  getTicketById: async (id) => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  // GET /tickets/customer/{id}
  getTicketByCustomerId: async (id, page = 0, size = 10) => {
    const params = {page, size};
    const response = await api.get(`/tickets/customer/${id}`, { params });
    return response.data;
  },

  // GET /tickets/technician/{id}
  getTicketByTechnicianId: async (id, page = 0, size = 10) => {
    const params = {page, size};
    const response = await api.get(`/tickets/technician/${id}`,{ params });
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

  // PATCH /tickets/{id} (close ticket)
  closeTicket: async (id) => {
    const response = await api.patch(`/tickets/${id}`);
    return response.data;
  }
};

