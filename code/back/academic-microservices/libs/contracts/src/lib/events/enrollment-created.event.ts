import { BaseEvent } from '../interfaces/base-event.interface';

export interface EnrollmentCreatedPayload {
  enrollmentId: string;
  studentId: string;
  courseName: string;
  enrolledAt: Date;
}

export type EnrollmentCreatedEvent =
  BaseEvent<EnrollmentCreatedPayload>;