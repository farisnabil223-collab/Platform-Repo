import { Injectable } from '@nestjs/common';

@Injectable()
export class TaxService {
  calculateTax(amount: number, countryCode?: string): { taxAmount: number; rate: number } {
    if (!countryCode) return { taxAmount: 0, rate: 0 };
    
    // Country specific VAT calculation logic
    const country = countryCode.toUpperCase();
    if (country === 'EG') {
      return { taxAmount: amount * 0.14, rate: 0.14 }; // 14% VAT Egypt
    }
    if (country === 'SA') {
      return { taxAmount: amount * 0.15, rate: 0.15 }; // 15% VAT KSA
    }
    
    return { taxAmount: 0, rate: 0 };
  }
}
