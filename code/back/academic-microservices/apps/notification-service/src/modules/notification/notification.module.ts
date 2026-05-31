import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { EnrollmentCreatedConsumer } from './consumers/enrollment-created.consumer';
import { StudentCreatedConsumer } from './consumers/student-created.consumer';
import { RabbitMQModule } from '@org/rabbitmq';

@Module({
  imports: [RabbitMQModule],
  providers: [
    NotificationService,
    StudentCreatedConsumer,
    EnrollmentCreatedConsumer,
  ],
})
export class NotificationModule {}
