export interface IContentDeliveryProvider {
  generateSignedDownloadUrl(resourceKey: string): Promise<string>;
}

export const IContentDeliveryProvider = Symbol('IContentDeliveryProvider');
