export interface IVideoProvider {
  generateSignedPlaybackUrl(videoKey: string): Promise<string>;
}

export const IVideoProvider = Symbol('IVideoProvider');
