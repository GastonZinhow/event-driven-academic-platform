import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StudentCreatedConsumer {
  private readonly logger = new Logger(
    StudentCreatedConsumer.name,
  );

  async handle(payload: any) {
    this.logger.log(
      `Processing student ${payload.data.name}`,
    );

    this.logger.log(
      `Welcome email sent to ${payload.data.email}`,
    );
  }
}