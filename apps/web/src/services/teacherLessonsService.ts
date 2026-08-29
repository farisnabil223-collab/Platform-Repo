import api from './api';

export const teacherLessonsService = {
  createLesson: async (courseId: string, data: any) => {
    const res = await api.post<any>('/lessons', { ...data, courseId });
    return res.data;
  },

  updateLesson: async (lessonId: string, data: any) => {
    const res = await api.put<any>(`/lessons/${lessonId}`, data);
    return res.data;
  },

  deleteLesson: async (lessonId: string) => {
    const res = await api.delete<any>(`/lessons/${lessonId}`);
    return res.data;
  },

  reorderLessons: async (courseId: string, lessonIds: string[]) => {
    const res = await api.post<any>(`/courses/${courseId}/lessons/reorder`, { lessonIds });
    return res.data;
  },
};
