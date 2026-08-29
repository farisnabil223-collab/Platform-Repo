export interface IMediaProvider {
  resolveUrl(path: string): string;
}
export const IMediaProvider = Symbol('IMediaProvider');
