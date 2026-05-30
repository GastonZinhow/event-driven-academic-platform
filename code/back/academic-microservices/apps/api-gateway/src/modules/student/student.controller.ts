import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { StudentService } from './student.service';

import { CreateStudentDto } from './dto/create-student.dto';

@Controller('students')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
  ) {}

  @Post()
  async create(
    @Body()
    createStudentDto: CreateStudentDto,
  ) {
    return this.studentService.create(
      createStudentDto,
    );
  }

  @Get()
  async findAll() {
    return this.studentService.findAll();
  }
}