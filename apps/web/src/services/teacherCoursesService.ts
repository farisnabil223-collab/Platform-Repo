import api from './api';

export const teacherCoursesService = {
  getCourses: async () => {
    try {
      const res = await api.get<any>('/courses');
      return res.data?.items || [];
    } catch (err) {
      return [];
    }
  },

  getCourseById: async (id: string) => {
    try {
      const res = await api.get<any>(`/courses/${id}`);
      return res.data || null;
    } catch (err) {
      return null;
    }
  },

  createCourse: async (data: any) => {
    const res = await api.post<any>('/courses', data);
    return res.data;
  },

  updateCourse: async (id: string, data: any) => {
    const res = await api.put<any>(`/courses/${id}`, data);
    return res.data;
  },

  deleteCourse: async (id: string) => {
    const res = await api.delete<any>(`/courses/${id}`);
    return res.data;
  },

  archiveCourse: async (id: string) => {
    const res = await api.post<any>(`/courses/${id}/archive`, {});
    return res.data;
  },
};
