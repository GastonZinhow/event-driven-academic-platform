import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/creat-enrollment.dto';
import { EnrollmentService } from './enrollment.service';

@Controller('enrollments')
export class EnrollmentController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
  ) {}

  @Post()
  async create(
    @Body()
    createEnrollmentDto: CreateEnrollmentDto,
  ) {
    return this.enrollmentService.create(
      createEnrollmentDto,
    );
  }

  @Get()
  async findAll() {
    return this.enrollmentService.findAll();
  }
}