import { DomainRuleViolationException } from './domain-exceptions';

export interface CalibrationTarget {
  id: string;
  isCalibrated: boolean;
  status: string;
}

export class EquipmentSafetyGuard {
  validateSafety(equipment: CalibrationTarget): void {
    if (!equipment.isCalibrated) {
      throw new DomainRuleViolationException('Equipment safety check failed: target is not calibrated');
    }
    if (equipment.status === 'MAINTENANCE') {
      throw new DomainRuleViolationException('Equipment safety check failed: target is under maintenance');
    }
  }
}

export interface EthicsTarget {
  id: string;
  ethicsState: string;
  status: string;
}

export class ProjectProposalWorkflow {
  transitionToActive(project: EthicsTarget): string {
    if (project.ethicsState !== 'APPROVED') {
      throw new DomainRuleViolationException('Project state transition failed: Ethics review must be APPROVED first');
    }
    return 'ACTIVE';
  }
}
