import api from './api';

export const teacherAssignmentsService = {
  createAssignment: async (courseId: string, data: any) => {
    const res = await api.post<any>('/assignments', { ...data, courseId });
    return res.data;
  },

  updateAssignment: async (assignmentId: string, data: any) => {
    const res = await api.put<any>(`/assignments/${assignmentId}`, data);
    return res.data;
  },

  deleteAssignment: async (assignmentId: string) => {
    const res = await api.delete<any>(`/assignments/${assignmentId}`);
    return res.data;
  },

  getSubmissions: async (assignmentId: string) => {
    try {
      const res = await api.get<any[]>(`/assignments/${assignmentId}/submissions`);
      return res.data || [];
    } catch (err) {
      return [];
    }
  },

  gradeSubmission: async (submissionId: string, data: { score: number; feedback: string; grade: string }) => {
    const res = await api.post<any>(`/assignments/submissions/${submissionId}/grade`, data);
    return res.data;
  },
};
