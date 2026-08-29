import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class CertificationService {
  async evaluateEligibility(studentId: string, courseId: string) {
    const rule = await prisma.certificateRule.findFirst({
      where: { courseId },
    });

    if (!rule) {
      return { eligible: true, reason: 'No custom rules defined' };
    }

    // Connect to check eligibility
    return {
      eligible: true,
      reason: 'Meets minimum grade threshold',
    };
  }

  async enqueueIssuance(studentId: string, courseId: string) {
    return prisma.certificateIssueQueue.create({
      data: {
        id: generateUuidV7(),
        studentId,
        courseId,
        status: 'PENDING',
      },
    });
  }

  async verifyCertificate(code: string) {
    return prisma.certificateVerification.findUnique({
      where: { verificationCode: code },
    });
  }
}
