export const PLATFORM_LIMITS = {
  MAX_PAGE_SIZE: 100,
  PASSWORD_MIN_LENGTH: 8,
  MAX_LOGIN_ATTEMPTS: 5,
};

export interface IFeatureFlags {
  isEnabled(flagName: string, context?: Record<string, any>): boolean;
}

export const FEATURE_FLAGS = {
  VIDEO_STREAMING_V2: 'video_streaming_v2',
  MAINTENANCE_MODE: 'maintenance_mode',
  STRIPE_PAYMENTS: 'stripe_payments',
};
