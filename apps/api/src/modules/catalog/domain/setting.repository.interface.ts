export interface ISettingRepository {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, userId?: string): Promise<void>;
}
export const ISettingRepository = Symbol('ISettingRepository');
