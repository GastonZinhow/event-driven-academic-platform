import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { randomUUID } from 'crypto';

import { RabbitMQService } from '@org/rabbitmq';

import { CreateStudentDto } from './dto/create-student.dto';
import { Student } from './student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,

    private readonly rabbitmqService: RabbitMQService,
  ) {}

  async create(createStudentDto: CreateStudentDto) {
    const student = this.studentRepository.create(createStudentDto);

    const savedStudent = await this.studentRepository.save(student);

    await this.rabbitmqService.publish('student.created', {
      eventId: randomUUID(),

      correlationId: randomUUID(),

      publishedAt: new Date().toISOString(),

      data: {
        id: savedStudent.id,
        name: savedStudent.name,
        email: savedStudent.email,
        createdAt: savedStudent.createdAt,
      },
    });

    return {
      message: 'Student created successfully',

      student: savedStudent,
    };
  }

  async findAll() {
    return this.studentRepository.find();
  }
}
