import { Injectable, Inject } from '@nestjs/common';
import { ISettingRepository } from '../domain/setting.repository.interface';

@Injectable()
export class FeatureFlagService {
  constructor(
    @Inject(ISettingRepository)
    private readonly settingRepository: ISettingRepository
  ) {}

  async isEnabled(flag: string): Promise<boolean> {
    const value = await this.settingRepository.get(`feature_flag_${flag}`);
    if (value === null) {
      // Default configurations
      if (flag === 'wishlist' || flag === 'coupons') return true;
      if (flag === 'ai_tutor' || flag === 'live_classes') return false;
      return false;
    }
    return value === 'true' || value === '1';
  }

  async setEnabled(flag: string, enabled: boolean, userId?: string): Promise<void> {
    await this.settingRepository.set(`feature_flag_${flag}`, enabled ? 'true' : 'false', userId);
  }
}
