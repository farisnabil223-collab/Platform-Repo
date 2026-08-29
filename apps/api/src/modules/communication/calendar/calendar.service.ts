import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { generateUuidV7 } from '@eduverse/kernel';

@Injectable()
export class CalendarService {
  async createEvent(data: {
    calendarId: string;
    title: string;
    description: string;
    startAt: Date;
    endAt: Date;
    recurrenceRule?: string;
  }) {
    return prisma.calendarEvent.create({
      data: {
        id: generateUuidV7(),
        calendarId: data.calendarId,
        title: data.title,
        description: data.description,
        startAt: data.startAt,
        endAt: data.endAt,
        recurrenceRule: data.recurrenceRule,
      },
    });
  }

  async respondInvitation(eventId: string, userId: string, response: 'ACCEPTED' | 'DECLINED' | 'TENTATIVE') {
    return prisma.eventParticipant.upsert({
      where: { id: `ep-${eventId}-${userId}` }, // Fallback unique mapping lookup
      update: { response },
      create: {
        id: `ep-${eventId}-${userId}`,
        eventId,
        userId,
        response,
      },
    });
  }
}
