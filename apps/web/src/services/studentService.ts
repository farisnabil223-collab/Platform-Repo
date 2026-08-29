import api from './api';
import { logger } from '@eduverse/ui';

class StudentService {
  async getCourses(): Promise<any[]> {
    logger.info('[API] Querying courses list...');
    try {
      const response = await api.get<any>('/courses');
      return response.data?.items || [];
    } catch (error) {
      logger.error('Failed to load courses from API:', error);
      return [];
    }
  }

  async getCourseById(id: string): Promise<any> {
    logger.info(`[API] Querying course outline for ID: ${id}`);
    try {
      const response = await api.get<any>(`/courses/${id}`);
      return response.data;
    } catch (error) {
      logger.error(`Failed to load course details for ID ${id}:`, error);
      return null;
    }
  }

  async getAssignments(): Promise<any[]> {
    logger.info('[API] Querying student assignments...');
    try {
      const response = await api.get<any>('/assignments');
      return response.data?.items || [];
    } catch (error) {
      logger.error('Failed to load assignments:', error);
      return [];
    }
  }

  async getQuizzes(): Promise<any[]> {
    logger.info('[API] Querying student assessments...');
    try {
      const response = await api.get<any>('/assessments');
      return response.data?.items || [];
    } catch (error) {
      logger.error('Failed to load assessments:', error);
      return [];
    }
  }

  async getExams(): Promise<any[]> {
    logger.info('[API] Querying exams schedulers...');
    try {
      const response = await api.get<any>('/exams');
      return response.data?.items || [];
    } catch (error) {
      logger.error('Failed to load exams:', error);
      return [];
    }
  }

  async getAnnouncements(): Promise<any[]> {
    logger.info('[API] Querying circular announcements...');
    try {
      const response = await api.get<any>('/announcements');
      return response.data?.items || [];
    } catch (error) {
      logger.error('Failed to load announcements:', error);
      return [];
    }
  }

  async getConversations(): Promise<any[]> {
    logger.info('[API] Querying conversation records...');
    try {
      const response = await api.get<any>('/communication/conversations');
      return response.data?.items || [];
    } catch (error) {
      logger.error('Failed to load conversations:', error);
      return [];
    }
  }

  async getGPA(): Promise<any> {
    logger.info('[API] Querying cumulative GPA profile...');
    try {
      const response = await api.get<any>('/students/me/gpa');
      return response.data;
    } catch (error) {
      logger.error('Failed to load GPA details:', error);
      return { overallGPA: '0.00', targetGPA: '4.00', history: [] };
    }
  }
}

export const studentService = new StudentService();
export default studentService;
