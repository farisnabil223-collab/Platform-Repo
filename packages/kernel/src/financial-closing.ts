import { JournalEntry, AccountingPeriod } from './payment-aggregates';

export class FinancialClosingService {
  canPostToPeriod(period: AccountingPeriod): boolean {
    return period.status === 'OPEN';
  }

  postJournal(journal: JournalEntry, period: AccountingPeriod): void {
    if (!this.canPostToPeriod(period)) {
      throw new Error('Cannot post journal entry: Accounting Period is CLOSED');
    }
    journal.post();
  }
}
