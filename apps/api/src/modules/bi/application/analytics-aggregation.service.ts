import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class AnalyticsAggregationService {
  async aggregateSnapshot(orgId: string) {
    const studentCount = await prisma.student.count();
    const teacherCount = await prisma.teacher.count();

    const org = await prisma.organization.findUniqueOrThrow({
      where: { id: orgId },
    });

    // Sum invoice amounts
    const invoices = await prisma.organizationInvoice.findMany({
      where: {
        billingAccount: {
          tenantId: org.tenantId,
        },
      },
    });
    const totalRevenue = invoices.reduce((acc, inv) => acc + inv.amount, 0);

    return prisma.organizationAnalyticsSnapshot.create({
      data: {
        id: generateUuidV7(),
        organizationId: orgId,
        activeStudents: studentCount,
        activeTeachers: teacherCount,
        revenue: totalRevenue,
      },
    });
  }
}
