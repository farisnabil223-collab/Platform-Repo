import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from '../controllers/chat.controller';
import { CalendarController } from '../controllers/calendar.controller';
import { LiveController } from '../controllers/live.controller';
import { CalendarService } from '../calendar/calendar.service';
import { LiveSessionService } from '../live/live-session.service';

describe('CommunicationModuleControllers', () => {
  let chatController: ChatController;
  let calendarController: CalendarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ChatController,
        CalendarController,
        LiveController,
      ],
      providers: [
        {
          provide: CalendarService,
          useValue: {
            createEvent: jest.fn().mockResolvedValue({}),
            respondInvitation: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: LiveSessionService,
          useValue: {
            startSession: jest.fn().mockResolvedValue({}),
            endSession: jest.fn().mockResolvedValue({}),
            addRecording: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    chatController = module.get<ChatController>(ChatController);
    calendarController = module.get<CalendarController>(CalendarController);
  });

  it('should be defined', () => {
    expect(chatController).toBeDefined();
    expect(calendarController).toBeDefined();
  });
});
