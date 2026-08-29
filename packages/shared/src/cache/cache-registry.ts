export const CACHE_TTL_POLICIES = {
  SHORT: 60,         // 1 minute
  DEFAULT: 300,      // 5 minutes
  LONG: 3600,        // 1 hour
  STATIC: 86400,     // 24 hours
};

export const CACHE_KEYS = {
  USER_SESSION: (userId: string) => `session:${userId}`,
  USER_PROFILE: (userId: string) => `profile:${userId}`,
  COURSE_CATALOG: () => 'courses:catalog',
  LESSON_CONTENT: (lessonId: string) => `lessons:${lessonId}`,
  FEATURE_FLAGS: () => 'system:feature_flags',
};
