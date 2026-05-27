import { BaseEvent } from '../interfaces/base-event.interface';

export interface StudentCreatedPayload {
  id: string;
  name: string;
  email: string;
}

export type StudentCreatedEvent = BaseEvent<StudentCreatedPayload>;