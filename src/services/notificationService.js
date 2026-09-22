import api from "./api";

export const notificationService = {
    getAllNotifications: async () => {
        // GET /notifications
        const response = await api.get('/notifications');
        return response.data;
    },

    getByRecipientId: async () => {
        // GET /notifications/recipient/{id}
        const response = await api.get(`/notifications/recipient/${id}`);
        return response.data;
    },

    getByNotificationId: async () => {
        // GET /notifications/{id}
        const response = await api.get(`/notifications/${id}`);
        return response.data;
    },

    readNotification: async () => {
        // PATCH /notifications/{id}
        const response = await api.patch(`/notifications/${id}`);
        return response.data;
    }
}

