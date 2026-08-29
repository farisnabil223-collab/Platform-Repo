import { JournalEntry } from './payment-aggregates';

export class DoubleEntryAccountingService {
  validate(journalEntry: JournalEntry): boolean {
    try {
      journalEntry.post();
      return true;
    } catch (e) {
      return false;
    }
  }
}
