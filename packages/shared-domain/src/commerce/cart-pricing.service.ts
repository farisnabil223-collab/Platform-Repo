import { Money } from '../value-objects/money';

export class CartPricingService {
  public static calculate(
    items: Array<{ price: number; discountPrice?: number; quantity: number }>,
    currency = 'USD',
    discountAmount = Money.zero('USD'),
    taxRate = 0.14
  ) {
    let subtotal = Money.zero(currency);
    for (const item of items) {
      const price = item.discountPrice || item.price;
      const itemSubtotal = Money.create(price, currency).multiply(item.quantity);
      subtotal = subtotal.add(itemSubtotal);
    }

    const netBeforeTax = subtotal.greaterThan(discountAmount)
      ? subtotal.subtract(discountAmount)
      : Money.zero(currency);

    const taxAmount = netBeforeTax.multiply(taxRate);
    const totalAmount = netBeforeTax.add(taxAmount);

    return {
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
    };
  }
}
