import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface BaseEvent {
  eventType: string;
  version: number;
  timestamp: Date;
  payload: any;
}

export class SharedEventBus {
  private static instance: SharedEventBus;
  private eventSubject = new Subject<BaseEvent>();

  private constructor() {}

  public static getInstance(): SharedEventBus {
    if (!SharedEventBus.instance) {
      SharedEventBus.instance = new SharedEventBus();
    }
    return SharedEventBus.instance;
  }

  public publish(event: BaseEvent): void {
    this.eventSubject.next(event);
  }

  public subscribe<T = any>(eventType: string): Observable<BaseEvent & { payload: T }> {
    return this.eventSubject.asObservable().pipe(
      filter((e) => e.eventType === eventType)
    ) as unknown as Observable<BaseEvent & { payload: T }>;
  }
}

export const EVENT_TYPES = {
  USER_CREATED: 'UserCreated',
  COURSE_PUBLISHED: 'CoursePublished',
  LESSON_PUBLISHED: 'LessonPublished',
  ASSIGNMENT_SUBMITTED: 'AssignmentSubmitted',
  ASSIGNMENT_GRADED: 'AssignmentGraded',
  ATTENDANCE_RECORDED: 'AttendanceRecorded',
  NOTIFICATION_CREATED: 'NotificationCreated',
  EMAIL_QUEUED: 'EmailQueued',
  MEDIA_UPLOADED: 'MediaUploaded',
};
