export interface IExchangeRateProvider {
  getRate(from: string, to: string): Promise<number>;
}

export const IExchangeRateProvider = Symbol('IExchangeRateProvider');
