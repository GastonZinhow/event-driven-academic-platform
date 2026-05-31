import { Injectable, Logger } from '@nestjs/common';

import * as amqp from 'amqplib';

import { RetryOptions } from './retry.types';

@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  async handleFailure(
    channel: amqp.Channel,
    routingKey: string,
    payload: any,
    options: RetryOptions,
  ) {
    const retryCount = payload.retryCount ?? 0;

    if (retryCount < options.maxRetries) {
      payload.retryCount = retryCount + 1;

      const delay = Math.pow(2, payload.retryCount) * 1000;

      this.logger.warn(
        `Retry ${payload.retryCount}/${options.maxRetries} scheduled in ${delay}ms`,
      );

      setTimeout(() => {
        channel.publish(
          options.exchange,
          routingKey,
          Buffer.from(JSON.stringify(payload)),
          {
            persistent: true,
          },
        );
      }, delay);

      return;
    }

    this.logger.error(`Max retries exceeded. Sending message to DLQ.`);

    channel.publish(
      options.deadLetterExchange,
      options.deadLetterRoutingKey,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
      },
    );
  }
}
