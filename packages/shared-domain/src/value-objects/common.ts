export class Percentage {
  private constructor(public readonly value: number) {
    if (value < 0 || value > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }
  }

  public static create(value: number): Percentage {
    return new Percentage(value);
  }

  public get decimalValue(): number {
    return this.value / 100;
  }
}

export class Email {
  private constructor(public readonly value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error(`Invalid email format: ${value}`);
    }
  }

  public static create(value: string): Email {
    return new Email(value.toLowerCase().trim());
  }
}

export class Phone {
  private constructor(public readonly value: string) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Basic international E.164 format check
    if (value && !phoneRegex.test(value)) {
      throw new Error(`Invalid phone number: ${value}`);
    }
  }

  public static create(value: string): Phone {
    return new Phone(value.trim());
  }
}
