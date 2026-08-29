export interface SearchFilters {
  category?: string;
  difficulty?: string;
  language?: string;
  tags?: string[];
  skills?: string[];
}

export interface SearchResultItem {
  courseId: string;
  title: string;
  slug: string;
  category: string;
  difficulty: string;
  estimatedMinutes: number;
}

export interface SearchResults {
  items: SearchResultItem[];
  total: number;
  facets?: any;
  nextCursor?: string;
}

export interface ISearchProvider {
  search(query: string, filters: SearchFilters, limit: number, cursor?: string): Promise<SearchResults>;
  indexCourse(course: SearchResultItem & { tags: string[]; skills: string[] }): Promise<void>;
  deindexCourse(courseId: string): Promise<void>;
}
