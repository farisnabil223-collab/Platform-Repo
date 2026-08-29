import { DomainRuleViolationException } from './domain-exceptions';

export interface MentoringSlot {
  mentorId: string;
  startTime: Date;
  endTime: Date;
}

export class MentorshipMatcher {
  verifyAvailability(slot: MentoringSlot, reservedSlots: MentoringSlot[]): void {
    const conflict = reservedSlots.some(r =>
      r.mentorId === slot.mentorId &&
      ((slot.startTime >= r.startTime && slot.startTime < r.endTime) ||
       (slot.endTime > r.startTime && slot.endTime <= r.endTime))
    );
    if (conflict) {
      throw new DomainRuleViolationException('Mentorship booking failed: mentor is not available at the selected slot');
    }
  }
}

export interface HiringPipelineTarget {
  id: string;
  step: string;
}

export class HiringPipelineValidator {
  validateStepTransition(currentStep: string, nextStep: string): void {
    const validSteps = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED'];
    if (!validSteps.includes(nextStep)) {
      throw new DomainRuleViolationException(`Pipeline transition failed: Invalid step state "${nextStep}"`);
    }
    if (currentStep === 'REJECTED') {
      throw new DomainRuleViolationException('Pipeline transition failed: Cannot transition a rejected application');
    }
  }
}
