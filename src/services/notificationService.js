import api from "./api";

export const notificationService = {
    // GET /notifications
    getAllNotifications: async (page = 0, size = 10, filters = {}) => {
        const params = { page, size, ...filters };
        const response = await api.get('/notifications', { params });
        return response.data;
    },

    // GET /notifications/{id}
    getByNotificationId: async (id) => {
        const response = await api.get(`/notifications/${id}`);
        return response.data;
    },

    // PATCH /notifications/{id}
    readNotification: async (id) => {
        const response = await api.patch(`/notifications/${id}`);
        return response.data;
    }
}

