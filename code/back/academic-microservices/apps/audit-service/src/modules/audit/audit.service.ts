import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as amqp from 'amqplib';

import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService implements OnModuleInit {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async onModuleInit() {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
    );

    const channel = await connection.createChannel();

    await channel.consume(
      'audit.queue',

      async (message) => {
        if (!message) return;

        try {
          const payload = JSON.parse(message.content.toString());

          const routingKey = message.fields.routingKey;

          this.logger.log(`Auditing event: ${routingKey}`);

          const saved = await this.auditRepository.save({
            eventType: routingKey,
            payload,
          });

          console.log(saved);

          channel.ack(message);

          this.logger.log(`Audit saved for ${routingKey}`);
        } catch (error) {
          this.logger.error('Audit processing failed', error);

          channel.nack(message, false, true);
        }
      },
    );

    this.logger.log('Audit consumer started');
  }
}
