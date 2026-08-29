import api from './api';

export const teacherAttendanceService = {
  getAttendanceSessions: async (courseId: string) => {
    try {
      const res = await api.get<any[]>(`/academic/attendance/${courseId}`);
      return res.data || [];
    } catch (err) {
      return [];
    }
  },

  createAttendanceSession: async (courseId: string, data: { date: string; sessionTitle: string }) => {
    const res = await api.post<any>('/academic/attendance', { ...data, courseId });
    return res.data;
  },

  markAttendance: async (sessionId: string, records: { studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE' }[]) => {
    const res = await api.post<any>(`/academic/attendance/${sessionId}/mark`, { records });
    return res.data;
  },
};
