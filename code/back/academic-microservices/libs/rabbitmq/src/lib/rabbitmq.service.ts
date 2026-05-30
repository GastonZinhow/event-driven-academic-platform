import {
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';

import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService
    implements OnModuleInit {
    private readonly logger = new Logger(
        RabbitMQService.name,
    );

    private connection!: amqp.ChannelModel;

    private channel!: amqp.Channel;

    private readonly exchange =
        process.env.RABBITMQ_EXCHANGE ||
        'academic.events.exchange';

    async onModuleInit() {
        await this.connect();
    }

    async connect() {
        this.connection = await amqp.connect(
            process.env.RABBITMQ_URL ||
            'amqp://guest:guest@localhost:5672',
        );

        this.channel =
            await this.connection.createChannel();

        // EXCHANGE

        await this.channel.assertExchange(
            this.exchange,
            'topic',
            {
                durable: true,
            },
        );

        // QUEUES

        await this.channel.assertQueue(
            'notification.queue',
            {
                durable: true,
            },
        );

        await this.channel.assertQueue(
            'audit.queue',
            {
                durable: true,
            },
        );

        // BINDINGS

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

        await this.channel.bindQueue(
            'audit.queue',
            this.exchange,
            '#',
        );

        this.logger.log(
            'RabbitMQ connected successfully',
        );
    }

    async publish(
        routingKey: string,
        message: unknown,
    ) {
        this.channel.publish(
            this.exchange,
            routingKey,
            Buffer.from(JSON.stringify(message)),
            {
                persistent: true,
            },
        );

        this.logger.log(
            `Event published: ${routingKey}`,
        );
    }

    getChannel() {
        return this.channel;
    }

    getExchange() {
        return this.exchange;
    }
}