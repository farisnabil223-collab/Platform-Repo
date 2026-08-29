export interface ISearchService {
  search(params: {
    query: string;
    type?: 'all' | 'courses' | 'teachers' | 'subjects';
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    courses: { items: any[]; total: number };
    teachers: { items: any[]; total: number };
    subjects: { items: any[]; total: number };
  }>;

  autocomplete(query: string, type?: string): Promise<string[]>;
  getSuggestions(query: string): Promise<string[]>;
  getRecentSearches(userId: string | null): Promise<string[]>;
  getPopularSearches(): Promise<string[]>;
  getTrendingSearches(): Promise<string[]>;
}
export const ISearchService = Symbol('ISearchService');
