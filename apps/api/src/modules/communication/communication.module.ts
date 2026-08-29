import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { CalendarController } from './controllers/calendar.controller';
import { LiveController } from './controllers/live.controller';
import { PresenceService } from './presence/presence.service';
import { SocketGateway } from './socket/socket.gateway';
import { CalendarService } from './calendar/calendar.service';
import { LiveSessionService } from './live/live-session.service';

@Module({
  controllers: [
    ChatController,
    CalendarController,
    LiveController,
  ],
  providers: [
    PresenceService,
    SocketGateway,
    CalendarService,
    LiveSessionService,
  ],
  exports: [
    PresenceService,
    SocketGateway,
    CalendarService,
    LiveSessionService,
  ],
})
export class CommunicationModule {}
