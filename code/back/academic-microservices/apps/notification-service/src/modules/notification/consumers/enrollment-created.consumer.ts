import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EnrollmentCreatedConsumer {
  private readonly logger = new Logger(
    EnrollmentCreatedConsumer.name,
  );

  async handle(payload: any) {
    await new Promise((resolve) =>
      setTimeout(resolve, 3000),
    );

    this.logger.log(
      `Enrollment processed for student ${payload.data.studentId}`,
    );

    this.logger.log(
      `Course enrolled: ${payload.data.course}`,
    );
  }
}