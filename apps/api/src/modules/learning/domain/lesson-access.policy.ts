import { ForbiddenException, Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';

@Injectable()
export class LessonAccessPolicy {
  async validateAccess(userId: string, lessonId: string): Promise<boolean> {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    const courseId = lesson.module.courseId;

    // 1. Entitlement / Purchase Validation
    const entitlement = await prisma.entitlement.findFirst({
      where: {
        ownerId: userId,
        productId: courseId,
        status: 'ACTIVE',
      },
    });

    if (!entitlement) {
      throw new ForbiddenException('Access Denied: Student is not enrolled in this course.');
    }

    // 2. Drip Release Validation
    const unlockCondition = lesson.unlockCondition as any;
    if (unlockCondition && unlockCondition.daysAfterPurchase) {
      const days = Number(unlockCondition.daysAfterPurchase);
      const purchaseDate = entitlement.grantedAt;
      const releaseDate = new Date(purchaseDate.getTime() + days * 24 * 60 * 60 * 1000);
      if (Date.now() < releaseDate.getTime()) {
        throw new ForbiddenException(`Access Denied: This content is dripped and unlocks on ${releaseDate.toLocaleDateString()}`);
      }
    }

    // 3. Prerequisite Validation
    if (unlockCondition && unlockCondition.prerequisiteLessonId) {
      const prereqId = String(unlockCondition.prerequisiteLessonId);
      const prereqCompletion = await prisma.lessonCompletion.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId: prereqId,
          },
        },
      });

      if (!prereqCompletion) {
        throw new ForbiddenException('Access Denied: Please complete the prerequisite lessons first.');
      }
    }

    return true;
  }
}

class NotFoundException extends Error {}
