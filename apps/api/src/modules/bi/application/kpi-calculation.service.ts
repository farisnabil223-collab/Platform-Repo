import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';
import { AnalyticsQueryEngine } from '../domain/analytics-query-engine.service';

@Injectable()
export class KpiCalculationService {
  constructor(private readonly queryEngine: AnalyticsQueryEngine) {}

  async calculateKpi(kpiId: string) {
    const kpi = await prisma.kpiDefinition.findUniqueOrThrow({
      where: { id: kpiId },
    });

    const varsObj = kpi.variables as Record<string, number>;
    const score = await this.queryEngine.evaluateFormula(kpi.formula, varsObj);

    // Save snapshot
    await prisma.kpiSnapshot.create({
      data: {
        id: generateUuidV7(),
        kpiDefinitionId: kpiId,
        value: score,
      },
    });

    // Check thresholds
    const threshold = await prisma.kpiThreshold.findFirst({
      where: { kpiDefinitionId: kpiId },
    });

    if (threshold && score < threshold.criticalMin) {
      await prisma.kpiAlert.create({
        data: {
          id: generateUuidV7(),
          kpiDefinitionId: kpiId,
          alertType: 'CRITICAL',
          message: `KPI "${kpi.name}" has dropped to critical value: ${score}`,
        },
      });
    }

    return score;
  }
}
