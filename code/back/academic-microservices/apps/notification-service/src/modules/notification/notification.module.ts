import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EnrollmentCreatedConsumer } from './consumers/enrollment-created.consumer';
import { StudentCreatedConsumer } from './consumers/student-created.consumer';

@Module({
  providers: [
    NotificationService,
    StudentCreatedConsumer,
    EnrollmentCreatedConsumer,
  ],
})
export class NotificationModule {}
