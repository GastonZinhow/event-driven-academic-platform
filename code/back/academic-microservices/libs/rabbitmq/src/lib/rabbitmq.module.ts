import { Global, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RetryService } from '../retry/retry.service';

@Global()
@Module({
  providers: [RabbitMQService, RetryService],
  exports: [RabbitMQService, RetryService],
})
export class RabbitMQModule {}