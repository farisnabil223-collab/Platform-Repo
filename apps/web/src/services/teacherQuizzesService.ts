import api from './api';

export const teacherQuizzesService = {
  createQuiz: async (courseId: string, data: any) => {
    const res = await api.post<any>('/quizzes', { ...data, courseId });
    return res.data;
  },

  updateQuiz: async (quizId: string, data: any) => {
    const res = await api.put<any>(`/quizzes/${quizId}`, data);
    return res.data;
  },

  deleteQuiz: async (quizId: string) => {
    const res = await api.delete<any>(`/quizzes/${quizId}`);
    return res.data;
  },

  getQuestionBank: async () => {
    try {
      const res = await api.get<any[]>('/quizzes/questions');
      return res.data || [];
    } catch (err) {
      return [];
    }
  },

  addQuestionToBank: async (data: any) => {
    const res = await api.post<any>('/quizzes/questions', data);
    return res.data;
  },
};
