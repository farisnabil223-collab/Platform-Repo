export interface ILearningRepository {
  findSectionById(id: string): Promise<any | null>;
  findSectionWithLessons(id: string): Promise<any | null>;
  findLessonById(id: string): Promise<any | null>;
  findLessonWithContent(id: string): Promise<any | null>;
  saveSection(section: any): Promise<void>;
  saveLesson(lesson: any): Promise<void>;
  
  findProgress(userId: string, lessonId: string): Promise<any | null>;
  saveProgress(progress: any): Promise<void>;
  
  findCompletion(userId: string, lessonId: string): Promise<any | null>;
  saveCompletion(completion: any): Promise<void>;
  
  findPlayerSession(id: string): Promise<any | null>;
  savePlayerSession(session: any): Promise<void>;
  
  findTimelineEvents(userId: string): Promise<any[]>;
  saveTimelineEvent(event: any): Promise<void>;
  
  findBookmark(id: string): Promise<any | null>;
  findBookmarksByUser(userId: string): Promise<any[]>;
  saveBookmark(bookmark: any): Promise<void>;
  deleteBookmark(id: string): Promise<void>;
  
  findNote(id: string): Promise<any | null>;
  findNotesByUser(userId: string): Promise<any[]>;
  saveNote(note: any): Promise<void>;
  deleteNote(id: string): Promise<void>;

  findTranscripts(lessonId: string): Promise<any[]>;
  saveTranscript(transcript: any): Promise<void>;

  findResourceById(id: string): Promise<any | null>;
  findResourcesByLesson(lessonId: string): Promise<any[]>;
  saveResource(resource: any): Promise<void>;
}

export const ILearningRepository = Symbol('ILearningRepository');
