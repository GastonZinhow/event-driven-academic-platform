import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import * as amqp from 'amqplib';

import { StudentCreatedConsumer } from './consumers/student-created.consumer';
import { EnrollmentCreatedConsumer } from './consumers/enrollment-created.consumer';
import { RetryService } from '@org/rabbitmq';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly studentCreatedConsumer: StudentCreatedConsumer,

    private readonly enrollmentCreatedConsumer: EnrollmentCreatedConsumer,

    private readonly retryService: RetryService,
  ) {}

  async onModuleInit() {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
    );

    const channel = await connection.createChannel();

    await channel.consume(
      'notification.queue',

      async (message) => {
        if (!message) return;

        let payload: any;
        let routingKey = '';

        try {
          payload = JSON.parse(message.content.toString());

          routingKey = message.fields.routingKey;

          const latencyMs =
            Date.now() - new Date(payload.publishedAt).getTime();

          this.logger.log(
            JSON.stringify({
              service: 'notification-service',
              event: routingKey,
              correlationId: payload.correlationId,
              latencyMs,
              status: 'CONSUMED',
            }),
          );

          switch (routingKey) {
            case 'student.created':
              await this.studentCreatedConsumer.handle(payload);
              break;

            case 'enrollment.created':
              await this.enrollmentCreatedConsumer.handle(payload);
              break;

            default:
              this.logger.warn(`Unknown routing key: ${routingKey}`);
          }

          channel.ack(message);
        } catch (error: any) {
          this.logger.error('Error processing message', error.message);

          await this.retryService.handleFailure(channel, routingKey, payload, {
            maxRetries: 3,

            exchange: 'academic.events.exchange',

            deadLetterExchange: 'academic.dlx.exchange',

            deadLetterRoutingKey: 'notification.failed',
          });

          channel.ack(message);
        }
      },
    );

    await this.startDlqConsumer(channel);

    this.logger.log('Notification consumer started');
  }

  private async startDlqConsumer(channel: amqp.Channel) {
    await channel.consume(
      'notification.dlq',

      async (message) => {
        if (!message) return;

        const payload = JSON.parse(message.content.toString());

        this.logger.error(
          JSON.stringify({
            service: 'notification-service',
            status: 'DLQ_RECEIVED',
            correlationId: payload.correlationId,
            retries: payload.retryCount,
          }),
        );

        channel.ack(message);
      },
    );
  }
}
