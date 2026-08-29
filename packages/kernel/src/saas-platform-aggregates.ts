import { AggregateRoot } from './aggregate-root';

export interface SubscriptionPlanProps {
  tenantId: string;
  name: string;
  price: number;
  billingCycle: string;
}

export class SubscriptionPlan extends AggregateRoot<SubscriptionPlanProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get price(): number { return this.props.price; }
  get billingCycle(): string { return this.props.billingCycle; }
}

export interface SubscriptionFeatureProps {
  tenantId: string;
  planId: string;
  featureKey: string;
  isEnabled: boolean;
}

export class SubscriptionFeature extends AggregateRoot<SubscriptionFeatureProps> {
  get tenantId(): string { return this.props.tenantId; }
  get planId(): string { return this.props.planId; }
  get featureKey(): string { return this.props.featureKey; }
  get isEnabled(): boolean { return this.props.isEnabled; }
}

export interface SubscriptionCycleProps {
  tenantId: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

export class SubscriptionCycle extends AggregateRoot<SubscriptionCycleProps> {
  get tenantId(): string { return this.props.tenantId; }
  get startDate(): Date { return this.props.startDate; }
  get endDate(): Date { return this.props.endDate; }
  get status(): string { return this.props.status; }
}

export interface SubscriptionAddonProps {
  tenantId: string;
  subId: string;
  addonKey: string;
  price: number;
}

export class SubscriptionAddon extends AggregateRoot<SubscriptionAddonProps> {
  get tenantId(): string { return this.props.tenantId; }
  get subId(): string { return this.props.subId; }
  get addonKey(): string { return this.props.addonKey; }
  get price(): number { return this.props.price; }
}

export interface UsageRecordProps {
  tenantId: string;
  subId: string;
  metricType: string;
  quantity: number;
}

export class UsageRecord extends AggregateRoot<UsageRecordProps> {
  get tenantId(): string { return this.props.tenantId; }
  get subId(): string { return this.props.subId; }
  get metricType(): string { return this.props.metricType; }
  get quantity(): number { return this.props.quantity; }
}

export interface UsageQuotaProps {
  tenantId: string;
  metricType: string;
  limitVal: number;
  currentVal: number;
}

export class UsageQuota extends AggregateRoot<UsageQuotaProps> {
  get tenantId(): string { return this.props.tenantId; }
  get metricType(): string { return this.props.metricType; }
  get limitVal(): number { return this.props.limitVal; }
  get currentVal(): number { return this.props.currentVal; }
}

export interface BillingAccountProps {
  tenantId: string;
  companyName: string;
  email: string;
  status: string;
}

export class BillingAccount extends AggregateRoot<BillingAccountProps> {
  get tenantId(): string { return this.props.tenantId; }
  get companyName(): string { return this.props.companyName; }
  get email(): string { return this.props.email; }
  get status(): string { return this.props.status; }
}

export interface SaasInvoiceItemProps {
  tenantId: string;
  invoiceId: string;
  description: string;
  amount: number;
}

export class InvoiceItem extends AggregateRoot<SaasInvoiceItemProps> {
  get tenantId(): string { return this.props.tenantId; }
  get invoiceId(): string { return this.props.invoiceId; }
  get description(): string { return this.props.description; }
  get amount(): number { return this.props.amount; }
}

export interface PaymentProviderProps {
  tenantId: string;
  providerName: string;
  apiKey: string;
  isActive: boolean;
}

export class PaymentProvider extends AggregateRoot<PaymentProviderProps> {
  get tenantId(): string { return this.props.tenantId; }
  get providerName(): string { return this.props.providerName; }
  get apiKey(): string { return this.props.apiKey; }
  get isActive(): boolean { return this.props.isActive; }
}

export interface CreditBalanceProps {
  tenantId: string;
  accountId: string;
  balance: number;
}

export class CreditBalance extends AggregateRoot<CreditBalanceProps> {
  get tenantId(): string { return this.props.tenantId; }
  get accountId(): string { return this.props.accountId; }
  get balance(): number { return this.props.balance; }
}

export interface PromotionProps {
  tenantId: string;
  name: string;
  couponId: string;
  expiresAt: Date;
}

export class Promotion extends AggregateRoot<PromotionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get couponId(): string { return this.props.couponId; }
  get expiresAt(): Date { return this.props.expiresAt; }
}

export interface DiscountRuleProps {
  tenantId: string;
  name: string;
  ruleJson: Record<string, any>;
}

export class DiscountRule extends AggregateRoot<DiscountRuleProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get ruleJson(): Record<string, any> { return this.props.ruleJson; }
}

export interface TaxProfileProps {
  tenantId: string;
  countryCode: string;
  taxId: string;
}

export class TaxProfile extends AggregateRoot<TaxProfileProps> {
  get tenantId(): string { return this.props.tenantId; }
  get countryCode(): string { return this.props.countryCode; }
  get taxId(): string { return this.props.taxId; }
}

export interface TaxRuleProps {
  tenantId: string;
  country: string;
  rate: number;
  ruleType: string;
}

export class TaxRule extends AggregateRoot<TaxRuleProps> {
  get tenantId(): string { return this.props.tenantId; }
  get country(): string { return this.props.country; }
  get rate(): number { return this.props.rate; }
  get ruleType(): string { return this.props.ruleType; }
}

export interface LicenseProps {
  tenantId: string;
  licenseKey: string;
  status: string;
  expiresAt: Date;
}

export class License extends AggregateRoot<LicenseProps> {
  get tenantId(): string { return this.props.tenantId; }
  get licenseKey(): string { return this.props.licenseKey; }
  get status(): string { return this.props.status; }
  get expiresAt(): Date { return this.props.expiresAt; }
}

export interface LicenseSeatProps {
  tenantId: string;
  licenseId: string;
  seatCode: string;
  isAssigned: boolean;
}

export class LicenseSeat extends AggregateRoot<LicenseSeatProps> {
  get tenantId(): string { return this.props.tenantId; }
  get licenseId(): string { return this.props.licenseId; }
  get seatCode(): string { return this.props.seatCode; }
  get isAssigned(): boolean { return this.props.isAssigned; }
}

export interface LicenseAssignmentProps {
  tenantId: string;
  seatId: string;
  assignedTo: string;
}

export class LicenseAssignment extends AggregateRoot<LicenseAssignmentProps> {
  get tenantId(): string { return this.props.tenantId; }
  get seatId(): string { return this.props.seatId; }
  get assignedTo(): string { return this.props.assignedTo; }
}

export interface OrganizationContractProps {
  tenantId: string;
  contractRef: string;
  value: number;
  isActive: boolean;
}

export class OrganizationContract extends AggregateRoot<OrganizationContractProps> {
  get tenantId(): string { return this.props.tenantId; }
  get contractRef(): string { return this.props.contractRef; }
  get value(): number { return this.props.value; }
  get isActive(): boolean { return this.props.isActive; }
}

export interface EnterpriseAgreementProps {
  tenantId: string;
  agreementRef: string;
  slaTier: string;
  signedAt: Date;
}

export class EnterpriseAgreement extends AggregateRoot<EnterpriseAgreementProps> {
  get tenantId(): string { return this.props.tenantId; }
  get agreementRef(): string { return this.props.agreementRef; }
  get slaTier(): string { return this.props.slaTier; }
  get signedAt(): Date { return this.props.signedAt; }
}

export interface MarketplaceProductProps {
  tenantId: string;
  name: string;
  price: number;
  productType: string;
  publisherId: string;
}

export class MarketplaceProduct extends AggregateRoot<MarketplaceProductProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get price(): number { return this.props.price; }
  get productType(): string { return this.props.productType; }
  get publisherId(): string { return this.props.publisherId; }
}

export interface MarketplaceOrderProps {
  tenantId: string;
  productId: string;
  amount: number;
}

export class MarketplaceOrder extends AggregateRoot<MarketplaceOrderProps> {
  get tenantId(): string { return this.props.tenantId; }
  get productId(): string { return this.props.productId; }
  get amount(): number { return this.props.amount; }
}

export interface MarketplacePublisherProps {
  tenantId: string;
  name: string;
  email: string;
  payoutMethod: string;
}

export class MarketplacePublisher extends AggregateRoot<MarketplacePublisherProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get email(): string { return this.props.email; }
  get payoutMethod(): string { return this.props.payoutMethod; }
}

export interface MarketplaceRevenueProps {
  tenantId: string;
  orderId: string;
  publisherCut: number;
  platformCut: number;
}

export class MarketplaceRevenue extends AggregateRoot<MarketplaceRevenueProps> {
  get tenantId(): string { return this.props.tenantId; }
  get orderId(): string { return this.props.orderId; }
  get publisherCut(): number { return this.props.publisherCut; }
  get platformCut(): number { return this.props.platformCut; }
}

export interface PartnerProps {
  tenantId: string;
  name: string;
  commissionPct: number;
}

export class Partner extends AggregateRoot<PartnerProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get commissionPct(): number { return this.props.commissionPct; }
}

export interface PartnerCommissionProps {
  tenantId: string;
  partnerId: string;
  amount: number;
  payoutStatus: string;
}

export class PartnerCommission extends AggregateRoot<PartnerCommissionProps> {
  get tenantId(): string { return this.props.tenantId; }
  get partnerId(): string { return this.props.partnerId; }
  get amount(): number { return this.props.amount; }
  get payoutStatus(): string { return this.props.payoutStatus; }
}

export interface ResellerProps {
  tenantId: string;
  name: string;
  discountPct: number;
}

export class Reseller extends AggregateRoot<ResellerProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get discountPct(): number { return this.props.discountPct; }
}

export interface CustomerPortalProfileProps {
  tenantId: string;
  companyName: string;
  themeConfig: Record<string, any>;
}

export class CustomerPortalProfile extends AggregateRoot<CustomerPortalProfileProps> {
  get tenantId(): string { return this.props.tenantId; }
  get companyName(): string { return this.props.companyName; }
  get themeConfig(): Record<string, any> { return this.props.themeConfig; }
}

export interface CustomerSupportTicketProps {
  tenantId: string;
  subject: string;
  severity: string;
  status: string;
}

export class CustomerSupportTicket extends AggregateRoot<CustomerSupportTicketProps> {
  get tenantId(): string { return this.props.tenantId; }
  get subject(): string { return this.props.subject; }
  get severity(): string { return this.props.severity; }
  get status(): string { return this.props.status; }
}

export interface CustomerHealthScoreProps {
  tenantId: string;
  score: number;
  riskLevel: string;
}

export class CustomerHealthScore extends AggregateRoot<CustomerHealthScoreProps> {
  get tenantId(): string { return this.props.tenantId; }
  get score(): number { return this.props.score; }
  get riskLevel(): string { return this.props.riskLevel; }
}

export interface CustomerSuccessPlaybookProps {
  tenantId: string;
  name: string;
  stepsJson: Record<string, any>;
  status: string;
}

export class CustomerSuccessPlaybook extends AggregateRoot<CustomerSuccessPlaybookProps> {
  get tenantId(): string { return this.props.tenantId; }
  get name(): string { return this.props.name; }
  get stepsJson(): Record<string, any> { return this.props.stepsJson; }
  get status(): string { return this.props.status; }
}

export interface RevenueMetricProps {
  tenantId: string;
  metricType: string;
  value: number;
}

export class RevenueMetric extends AggregateRoot<RevenueMetricProps> {
  get tenantId(): string { return this.props.tenantId; }
  get metricType(): string { return this.props.metricType; }
  get value(): number { return this.props.value; }
}

export interface MRRSnapshotProps {
  tenantId: string;
  mrr: number;
}

export class MRRSnapshot extends AggregateRoot<MRRSnapshotProps> {
  get tenantId(): string { return this.props.tenantId; }
  get mrr(): number { return this.props.mrr; }
}

export interface ARRSnapshotProps {
  tenantId: string;
  arr: number;
}

export class ARRSnapshot extends AggregateRoot<ARRSnapshotProps> {
  get tenantId(): string { return this.props.tenantId; }
  get arr(): number { return this.props.arr; }
}

export interface ChurnMetricProps {
  tenantId: string;
  churnRate: number;
}

export class ChurnMetric extends AggregateRoot<ChurnMetricProps> {
  get tenantId(): string { return this.props.tenantId; }
  get churnRate(): number { return this.props.churnRate; }
}

export interface ExpansionRevenueProps {
  tenantId: string;
  amount: number;
  source: string;
}

export class ExpansionRevenue extends AggregateRoot<ExpansionRevenueProps> {
  get tenantId(): string { return this.props.tenantId; }
  get amount(): number { return this.props.amount; }
  get source(): string { return this.props.source; }
}
