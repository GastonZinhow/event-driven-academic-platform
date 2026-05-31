import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQService.name);

  private connection!: amqp.ChannelModel;

  private channel!: amqp.Channel;

  private readonly exchange =
    process.env.RABBITMQ_EXCHANGE || 'academic.events.exchange';

  async onModuleInit() {
    await this.connect();
  }

  async connect() {
    this.connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    );

    this.channel = await this.connection.createChannel();

    // ─── EXCHANGES ────────────────────────────────────────────────

    await this.channel.assertExchange(this.exchange, 'topic', {
      durable: true,
    });

    await this.channel.assertExchange('academic.dlx.exchange', 'direct', {
      durable: true,
    });

    // ─── QUEUES (main) ────────────────────────────────────────────

    await this.channel.assertQueue('notification.queue', {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'academic.dlx.exchange',
        'x-dead-letter-routing-key': 'notification.failed',
      },
    });

    await this.channel.assertQueue('audit.queue', {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': 'academic.dlx.exchange',
        'x-dead-letter-routing-key': 'audit.failed',
      },
    });

    // ─── QUEUES (dead letter) ─────────────────────────────────────

    await this.channel.assertQueue('notification.dlq', { durable: true });
    await this.channel.assertQueue('audit.dlq', { durable: true });

    // ─── BINDINGS (main) ──────────────────────────────────────────

    await this.channel.bindQueue(
      'notification.queue',
      this.exchange,
      'student.created',
    );
    await this.channel.bindQueue(
      'notification.queue',
      this.exchange,
      'enrollment.created',
    );
    await this.channel.bindQueue('audit.queue', this.exchange, '#');

    // ─── BINDINGS (dead letter) ───────────────────────────────────

    await this.channel.bindQueue(
      'notification.dlq',
      'academic.dlx.exchange',
      'notification.failed',
    );
    await this.channel.bindQueue(
      'audit.dlq',
      'academic.dlx.exchange',
      'audit.failed',
    );

    this.logger.log('RabbitMQ connected successfully');
  }

  async publish(routingKey: string, message: unknown) {
    this.channel.publish(
      this.exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
      {
        persistent: true,
      },
    );

    this.logger.log(`Event published: ${routingKey}`);
  }

  getChannel() {
    return this.channel;
  }

  getExchange() {
    return this.exchange;
  }
}
