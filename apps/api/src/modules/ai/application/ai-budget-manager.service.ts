import { Injectable, ForbiddenException } from '@nestjs/common';
import { prisma } from '@eduverse/database';

@Injectable()
export class AIBudgetManager {
  async verifyAndConsumeBudget(orgId: string, tokensUsed: number) {
    const costPerToken = 0.00002; // Standard mock cost
    const estimatedCost = tokensUsed * costPerToken;

    const budget = await prisma.aiBudget.findUnique({
      where: { organizationId: orgId },
    });

    if (budget && budget.usedAmount + estimatedCost > budget.monthlyLimit) {
      throw new ForbiddenException('Monthly AI Platform budget limit exceeded for organization.');
    }

    // Increment budget consumption
    await prisma.aiBudget.upsert({
      where: { organizationId: orgId },
      update: { usedAmount: { increment: estimatedCost } },
      create: {
        id: 'b-' + orgId.substring(2),
        organizationId: orgId,
        usedAmount: estimatedCost,
      },
    });

    return true;
  }
}
