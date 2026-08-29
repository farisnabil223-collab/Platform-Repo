import { DomainRuleViolationException } from './domain-exceptions';

export interface TokenState {
  nodeId: string;
  status: string; // ACTIVE, COMPLETED
}

export class WorkflowEngineEvaluator {
  evaluateTransitions(tokens: TokenState[], gatewayConfig: any): TokenState[] {
    const parallelJoins = gatewayConfig.parallelJoins ?? [];
    let updated = [...tokens];

    for (const joinNode of parallelJoins) {
      const incoming = joinNode.incomingNodes as string[];
      const activeIncoming = updated.filter(t => incoming.includes(t.nodeId) && t.status === 'COMPLETED');

      // If all parallel branches have finished, merge them and generate a token for the next node
      if (activeIncoming.length === incoming.length && incoming.length > 0) {
        updated = updated.filter(t => !incoming.includes(t.nodeId));
        updated.push({ nodeId: joinNode.outgoingNode, status: 'ACTIVE' });
      }
    }
    return updated;
  }
}

export interface StageDecision {
  stageId: string;
  approverId: string;
  decision: string; // GRANTED, REJECTED
}

export class ApprovalFlowEngine {
  isStageApproved(decisions: StageDecision[], stageRequiredApprovals: number): boolean {
    const grants = decisions.filter(d => d.decision === 'GRANTED').length;
    const rejections = decisions.filter(d => d.decision === 'REJECTED').length;

    if (rejections > 0) {
      throw new DomainRuleViolationException('Approval flow failed: Stage has been rejected');
    }
    return grants >= stageRequiredApprovals;
  }
}

export class BusinessRulesEngine {
  evaluate(expression: string, context: Record<string, any>): boolean {
    // Simple rules engine evaluating dynamic boolean logic expression parameters safely
    try {
      const keys = Object.keys(context);
      const values = Object.values(context);
      const fn = new Function(...keys, `return Boolean(${expression});`);
      return fn(...values);
    } catch (e) {
      throw new DomainRuleViolationException(`Rules Engine evaluation error: Invalid expression "${expression}"`);
    }
  }
}
