import { DomainRuleViolationException } from './domain-exceptions';

export interface TranslationTarget {
  id: string;
  translatedText: string;
  status: string;
}

export class TranslationEngine {
  resolveText(translation: TranslationTarget, englishDefault: string): string {
    if (translation.status === 'PENDING_REVIEW') {
      // Fall back to default English string if translation is pending approval
      return englishDefault;
    }
    return translation.translatedText;
  }
}

export class CurrencyConverter {
  convert(amount: number, fromRate: number, toRate: number): number {
    if (fromRate <= 0 || toRate <= 0) {
      throw new DomainRuleViolationException('Currency conversion failed: Exchange rates must be positive values');
    }
    const baseAmt = amount / fromRate;
    const converted = baseAmt * toRate;
    // Format to currency precision (e.g. 4 decimal places)
    return Math.round(converted * 10000) / 10000;
  }
}
