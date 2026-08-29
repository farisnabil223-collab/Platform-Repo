import { Injectable } from '@nestjs/common';
import { prisma } from '@eduverse/database';
import { BookmarkCreatedEvent, DomainEventBus, generateUuidV7 } from '@eduverse/kernel';
import { BookmarkDto } from '../../dto/progress.dto';

@Injectable()
export class CreateBookmarkHandler {
  async execute(lessonId: string, dto: BookmarkDto) {
    const bookmarkId = generateUuidV7();

    const bookmark = await prisma.bookmark.create({
      data: {
        id: bookmarkId,
        studentId: dto.studentId,
        lessonId,
        secondsOffset: dto.secondsOffset,
        noteText: dto.noteText,
      },
    });

    // Publish event
    await DomainEventBus.getInstance().publish(
      new BookmarkCreatedEvent(dto.studentId, lessonId, bookmarkId)
    );

    return bookmark;
  }
}
