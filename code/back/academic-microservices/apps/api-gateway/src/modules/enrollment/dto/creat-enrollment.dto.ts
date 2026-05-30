import {
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID()
  studentId!: string;

  @IsString()
  course!: string;
}