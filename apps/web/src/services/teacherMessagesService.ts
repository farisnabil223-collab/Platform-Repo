import api from './api';

export const teacherMessagesService = {
  getConversations: async () => {
    try {
      const res = await api.get<any[]>('/communication/conversations');
      return res.data || [];
    } catch (err) {
      return [];
    }
  },

  sendMessage: async (recipientId: string, text: string) => {
    const res = await api.post<any>('/communication/send', { recipientId, text });
    return res.data;
  },

  broadcastMessage: async (courseId: string, text: string) => {
    const res = await api.post<any>('/communication/broadcast', { courseId, text });
    return res.data;
  },
};
