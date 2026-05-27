export interface BaseEvent<T> {
  eventId: string;
  eventType: string;
  timestamp: Date;
  payload: T;
}