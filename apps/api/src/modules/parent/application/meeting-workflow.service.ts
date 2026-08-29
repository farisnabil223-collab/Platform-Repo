import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class MeetingWorkflowService {
  async scheduleMeeting(orgId: string, title: string, scheduledAt: Date, participantUserIds: string[]) {
    return prisma.$transaction(async (tx) => {
      const meetingId = generateUuidV7();

      const meeting = await tx.meeting.create({
        data: {
          id: meetingId,
          organizationId: orgId,
          title,
          status: 'SCHEDULED',
          scheduledAt,
        },
      });

      for (const uid of participantUserIds) {
        await tx.meetingParticipant.create({
          data: {
            id: generateUuidV7(),
            meetingId,
            userId: uid,
          },
        });
      }

      return meeting;
    });
  }

  async recordMinutes(meetingId: string, authorId: string, note: string) {
    return prisma.meetingNote.create({
      data: {
        id: generateUuidV7(),
        meetingId,
        authorId,
        note,
      },
    });
  }

  async addAction(meetingId: string, title: string, assigneeId: string) {
    return prisma.meetingAction.create({
      data: {
        id: generateUuidV7(),
        meetingId,
        title,
        assigneeId,
        status: 'TODO',
      },
    });
  }
}
