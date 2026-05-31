import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { randomUUID } from 'crypto';

import { RabbitMQService } from '@org/rabbitmq';
import { CreateEnrollmentDto } from './dto/creat-enrollment.dto';
import { Enrollment } from './enrollment.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,

    private readonly rabbitmqService: RabbitMQService,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const enrollment = this.enrollmentRepository.create(createEnrollmentDto);

    const savedEnrollment = await this.enrollmentRepository.save(enrollment);

    await this.rabbitmqService.publish('enrollment.created', {
      eventId: randomUUID(),

      correlationId: randomUUID(),

      publishedAt: new Date().toISOString(),

      data: {
        id: savedEnrollment.id,

        studentId: savedEnrollment.studentId,

        course: savedEnrollment.course,

        createdAt: savedEnrollment.createdAt,
      },
    });

    return {
      message: 'Enrollment created successfully',

      enrollment: savedEnrollment,
    };
  }

  async findAll() {
    return this.enrollmentRepository.find();
  }
}
