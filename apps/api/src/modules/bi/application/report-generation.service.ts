import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class ReportGenerationService {
  async executeReport(reportId: string, parameters: Record<string, string>) {
    const report = await prisma.report.findUniqueOrThrow({
      where: { id: reportId },
    });

    const sections = await prisma.reportSection.findMany({
      where: { reportId },
      include: { charts: true },
    });

    const runtimeParams = await prisma.reportParameter.findMany({
      where: { reportId },
    });

    // Validate parameters
    for (const rp of runtimeParams) {
      if (rp.required && !parameters[rp.parameterName]) {
        throw new Error(`Missing required parameter: ${rp.parameterName}`);
      }
    }

    const durationMs = 150;
    const fileUrl = `https://storage.eduverse.com/exports/report-${reportId}-${Date.now()}.pdf`;

    return {
      reportId,
      title: report.title,
      sections,
      fileUrl,
      durationMs,
    };
  }
}
