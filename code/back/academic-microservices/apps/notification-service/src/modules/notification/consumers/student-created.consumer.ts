import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StudentCreatedConsumer {
  private readonly logger = new Logger(StudentCreatedConsumer.name);

  async handle(payload: any) {
    if (payload.data.email.endsWith('@error.com')) {
      throw new Error('Simulated notification failure');
    }

    this.logger.log(`Processing student ${payload.data.name}`);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.logger.log(`Welcome email sent to ${payload.data.email}`);
  }
}
