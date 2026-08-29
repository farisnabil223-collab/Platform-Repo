import { AggregateRoot } from './aggregate-root';

export interface PaymentIntentProps {
  userId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethodId?: string;
  clientSecret: string;
}

export class PaymentIntent extends AggregateRoot<PaymentIntentProps> {
  private _userId: string;
  private _amount: number;
  private _currency: string;
  private _status: string;
  private _paymentMethodId: string | null;
  private _clientSecret: string;

  constructor(id: string, props: PaymentIntentProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._userId = props.userId;
    this._amount = props.amount;
    this._currency = props.currency;
    this._status = props.status;
    this._paymentMethodId = props.paymentMethodId || null;
    this._clientSecret = props.clientSecret;
  }

  get userId(): string { return this._userId; }
  get amount(): number { return this._amount; }
  get currency(): string { return this._currency; }
  get status(): string { return this._status; }
  get paymentMethodId(): string | null { return this._paymentMethodId; }
  get clientSecret(): string { return this._clientSecret; }

  updateStatus(newStatus: string): void {
    this._status = newStatus;
  }
}

export interface PaymentMethodProps {
  userId: string;
  type: string;
  provider: string;
  token: string;
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export class PaymentMethod extends AggregateRoot<PaymentMethodProps> {
  private _userId: string;
  private _type: string;
  private _provider: string;
  private _token: string;
  private _last4: string | null;
  private _expiryMonth: number | null;
  private _expiryYear: number | null;
  private _isDefault: boolean;

  constructor(id: string, props: PaymentMethodProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._userId = props.userId;
    this._type = props.type;
    this._provider = props.provider;
    this._token = props.token;
    this._last4 = props.last4 || null;
    this._expiryMonth = props.expiryMonth || null;
    this._expiryYear = props.expiryYear || null;
    this._isDefault = props.isDefault;
  }

  get userId(): string { return this._userId; }
  get type(): string { return this._type; }
  get provider(): string { return this._provider; }
  get token(): string { return this._token; }
  get last4(): string | null { return this._last4; }
  get expiryMonth(): number | null { return this._expiryMonth; }
  get expiryYear(): number | null { return this._expiryYear; }
  get isDefault(): boolean { return this._isDefault; }
}

export interface AccountProps {
  code: string;
  name: string;
  type: string;
}

export class Account extends AggregateRoot<AccountProps> {
  private _code: string;
  private _name: string;
  private _type: string;

  constructor(id: string, props: AccountProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._code = props.code;
    this._name = props.name;
    this._type = props.type;
  }

  get code(): string { return this._code; }
  get name(): string { return this._name; }
  get type(): string { return this._type; }
}

export interface LedgerEntryProps {
  journalEntryId: string;
  accountId: string;
  entryType: 'DEBIT' | 'CREDIT';
  amount: number;
}

export class LedgerEntry extends AggregateRoot<LedgerEntryProps> {
  constructor(id: string, props: LedgerEntryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
  }
}

export interface JournalEntryProps {
  referenceNumber: string;
  description: string;
  postingStatus: string;
  postedAt?: Date;
  periodId?: string;
  entries: LedgerEntryProps[];
}

export class JournalEntry extends AggregateRoot<JournalEntryProps> {
  private _referenceNumber: string;
  private _description: string;
  private _postingStatus: string;
  private _periodId: string | null;
  private _entries: LedgerEntryProps[];

  constructor(id: string, props: JournalEntryProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._referenceNumber = props.referenceNumber;
    this._description = props.description;
    this._postingStatus = props.postingStatus;
    this._periodId = props.periodId || null;
    this._entries = props.entries;
  }

  get referenceNumber(): string { return this._referenceNumber; }
  get description(): string { return this._description; }
  get postingStatus(): string { return this._postingStatus; }
  get periodId(): string | null { return this._periodId; }
  get entries(): LedgerEntryProps[] { return this._entries; }

  post(): void {
    const debits = this.props.entries.filter(e => e.entryType === 'DEBIT').reduce((acc, curr) => acc + curr.amount, 0);
    const credits = this.props.entries.filter(e => e.entryType === 'CREDIT').reduce((acc, curr) => acc + curr.amount, 0);

    if (Math.abs(debits - credits) > 0.001) {
      throw new Error('Double entry bookkeeping rules violated: Debits must equal Credits');
    }
    this._postingStatus = 'POSTED';
  }
}

export interface FiscalYearProps {
  year: number;
  startDate: Date;
  endDate: Date;
}

export class FiscalYear extends AggregateRoot<FiscalYearProps> {
  private _year: number;
  private _startDate: Date;
  private _endDate: Date;

  constructor(id: string, props: FiscalYearProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._year = props.year;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
  }

  get year(): number { return this._year; }
  get startDate(): Date { return this._startDate; }
  get endDate(): Date { return this._endDate; }
}

export interface AccountingPeriodProps {
  fiscalYearId: string;
  periodNumber: number;
  startDate: Date;
  endDate: Date;
  status: 'OPEN' | 'CLOSED';
}

export class AccountingPeriod extends AggregateRoot<AccountingPeriodProps> {
  private _fiscalYearId: string;
  private _periodNumber: number;
  private _status: 'OPEN' | 'CLOSED';

  constructor(id: string, props: AccountingPeriodProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._fiscalYearId = props.fiscalYearId;
    this._periodNumber = props.periodNumber;
    this._status = props.status;
  }

  get fiscalYearId(): string { return this._fiscalYearId; }
  get periodNumber(): number { return this._periodNumber; }
  get status(): 'OPEN' | 'CLOSED' { return this._status; }

  close(): void {
    this._status = 'CLOSED';
  }

  reopen(): void {
    this._status = 'OPEN';
  }
}

export interface PaymentProps {
  userId: string;
  intentId?: string;
  amount: number;
  currency: string;
  status: string;
  referenceId?: string;
}

export class Payment extends AggregateRoot<PaymentProps> {
  private _userId: string;
  private _amount: number;
  private _currency: string;
  private _status: string;
  private _referenceId: string | null;

  constructor(id: string, props: PaymentProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._userId = props.userId;
    this._amount = props.amount;
    this._currency = props.currency;
    this._status = props.status;
    this._referenceId = props.referenceId || null;
  }

  get userId(): string { return this._userId; }
  get amount(): number { return this._amount; }
  get currency(): string { return this._currency; }
  get status(): string { return this._status; }
  get referenceId(): string | null { return this._referenceId; }

  updateStatus(newStatus: string): void {
    this._status = newStatus;
  }
}

export interface InvoiceItemProps {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
}

export interface InvoiceProps {
  userId: string;
  subscriptionId?: string;
  invoiceNumber: string;
  status: string;
  subTotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  currency: string;
  dueDate: Date;
  items: InvoiceItemProps[];
}

export class Invoice extends AggregateRoot<InvoiceProps> {
  private _userId: string;
  private _invoiceNumber: string;
  private _status: string;
  private _grandTotal: number;

  constructor(id: string, props: InvoiceProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._userId = props.userId;
    this._invoiceNumber = props.invoiceNumber;
    this._status = props.status;
    this._grandTotal = props.grandTotal;
  }

  get userId(): string { return this._userId; }
  get invoiceNumber(): string { return this._invoiceNumber; }
  get status(): string { return this._status; }
  get grandTotal(): number { return this._grandTotal; }
}

export interface SubscriptionProps {
  userId: string;
  planId: string;
  status: string;
  autoRenew: boolean;
  startedAt: Date;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  expiresAt?: Date;
}

export class Subscription extends AggregateRoot<SubscriptionProps> {
  private _userId: string;
  private _planId: string;
  private _status: string;

  constructor(id: string, props: SubscriptionProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._userId = props.userId;
    this._planId = props.planId;
    this._status = props.status;
  }

  get userId(): string { return this._userId; }
  get planId(): string { return this._planId; }
  get status(): string { return this._status; }

  updateStatus(newStatus: string): void {
    this._status = newStatus;
  }
}

export interface UserWalletProps {
  userId: string;
  balance: number;
  currency: string;
}

export class UserWallet extends AggregateRoot<UserWalletProps> {
  private _userId: string;
  private _balance: number;
  private _currency: string;

  constructor(id: string, props: UserWalletProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._userId = props.userId;
    this._balance = props.balance;
    this._currency = props.currency;
  }

  get userId(): string { return this._userId; }
  get balance(): number { return this._balance; }
  get currency(): string { return this._currency; }

  credit(amount: number): void {
    if (amount <= 0) throw new Error('Credit amount must be positive');
    this._balance += amount;
  }

  debit(amount: number): void {
    if (amount <= 0) throw new Error('Debit amount must be positive');
    if (this._balance < amount) throw new Error('Insufficient balance');
    this._balance -= amount;
  }
}

export interface CouponProps {
  campaignId: string;
  code: string;
  type: string;
  value: number;
  usageLimit: number;
  usageCount: number;
  maxPerUser: number;
  expiresAt?: Date;
}

export class Coupon extends AggregateRoot<CouponProps> {
  private _code: string;
  private _type: string;
  private _value: number;

  constructor(id: string, props: CouponProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._code = props.code;
    this._type = props.type;
    this._value = props.value;
  }

  get code(): string { return this._code; }
  get type(): string { return this._type; }
  get value(): number { return this._value; }
}

export interface RefundProps {
  paymentId: string;
  amount: number;
  reason: string;
  status: string;
}

export class Refund extends AggregateRoot<RefundProps> {
  private _paymentId: string;
  private _amount: number;
  private _status: string;

  constructor(id: string, props: RefundProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._paymentId = props.paymentId;
    this._amount = props.amount;
    this._status = props.status;
  }

  get paymentId(): string { return this._paymentId; }
  get amount(): number { return this._amount; }
  get status(): string { return this._status; }
}

export interface SettlementProps {
  amount: number;
  status: string;
  bankRef?: string;
}

export class Settlement extends AggregateRoot<SettlementProps> {
  private _amount: number;
  private _status: string;

  constructor(id: string, props: SettlementProps, version?: number, createdAt?: Date, updatedAt?: Date) {
    super(id, props, version, createdAt, updatedAt);
    this._amount = props.amount;
    this._status = props.status;
  }

  get amount(): number { return this._amount; }
  get status(): string { return this._status; }
}
