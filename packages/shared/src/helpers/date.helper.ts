export class DateHelper {
  public static addMinutes(date: Date, minutes: number): Date {
    const copy = new Date(date);
    copy.setMinutes(copy.getMinutes() + minutes);
    return copy;
  }

  public static addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  public static isExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }
}
