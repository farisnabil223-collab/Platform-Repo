export interface IAIContentGenerator {
  generateLessonContent(prompt: string): Promise<string>;
}
export const IAIContentGenerator = Symbol('IAIContentGenerator');

export interface IAIQuestionGenerator {
  generateQuestions(topic: string, count: number): Promise<any[]>;
}
export const IAIQuestionGenerator = Symbol('IAIQuestionGenerator');

export interface IAILessonSummarizer {
  summarizeLesson(transcriptText: string): Promise<string>;
}
export const IAILessonSummarizer = Symbol('IAILessonSummarizer');

export interface IAICourseOutlineGenerator {
  generateOutline(topic: string): Promise<any>;
}
export const IAICourseOutlineGenerator = Symbol('IAICourseOutlineGenerator');

export interface IAITranslationProvider {
  translate(text: string, targetLang: string): Promise<string>;
}
export const IAITranslationProvider = Symbol('IAITranslationProvider');
