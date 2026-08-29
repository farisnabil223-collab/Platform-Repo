import api from './api';

export const teacherService = {
  getOverviewStats: async () => {
    try {
      const res = await api.get<any>('/teachers/stats');
      return res.data || {
        activeStudents: 35,
        gradingQueue: 5,
        averagePerformance: 84.1,
      };
    } catch (err) {
      return {
        activeStudents: 35,
        gradingQueue: 5,
        averagePerformance: 84.1,
      };
    }
  },

  getRecentActivity: async () => {
    try {
      const res = await api.get<any[]>('/teachers/activities');
      return res.data || [
        { id: '1', title: 'Calculus Assignment Graded', time: '1 hr ago', description: 'Graded 14 submissions for integrals homework.' },
        { id: '2', title: 'Syllabus Updated', time: 'Yesterday', description: 'Quantum Physics syllabus version 1.2 published.' },
      ];
    } catch (err) {
      return [
        { id: '1', title: 'Calculus Assignment Graded', time: '1 hr ago', description: 'Graded 14 submissions for integrals homework.' },
        { id: '2', title: 'Syllabus Updated', time: 'Yesterday', description: 'Quantum Physics syllabus version 1.2 published.' },
      ];
    }
  },
};
