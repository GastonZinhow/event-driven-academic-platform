import {
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';

import * as amqp from 'amqplib';

import { StudentCreatedConsumer } from './consumers/student-created.consumer';
import { EnrollmentCreatedConsumer } from './consumers/enrollment-created.consumer';

@Injectable()
export class NotificationService
  implements OnModuleInit
{
  private readonly logger = new Logger(
    NotificationService.name,
  );

  constructor(
    private readonly studentCreatedConsumer: StudentCreatedConsumer,

    private readonly enrollmentCreatedConsumer: EnrollmentCreatedConsumer,
  ) {}

  async onModuleInit() {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL ??
        'amqp://guest:guest@localhost:5672',
    );

    const channel =
      await connection.createChannel();

    await channel.consume(
      'notification.queue',

      async (message) => {
        if (!message) return;

        try {
          const payload = JSON.parse(
            message.content.toString(),
          );

          const routingKey =
            message.fields.routingKey;

          this.logger.log(
            `Received event: ${routingKey}`,
          );

          switch (routingKey) {
            case 'student.created':
              await this.studentCreatedConsumer.handle(
                payload,
              );
              break;

            case 'enrollment.created':
              await this.enrollmentCreatedConsumer.handle(
                payload,
              );
              break;

            default:
              this.logger.warn(
                `Unknown routing key: ${routingKey}`,
              );
          }

          channel.ack(message);
        } catch (error) {
          this.logger.error(
            'Error processing message',
            error,
          );

          channel.nack(
            message,
            false,
            true,
          );
        }
      },
    );

    this.logger.log(
      'Notification consumer started',
    );
  }
}