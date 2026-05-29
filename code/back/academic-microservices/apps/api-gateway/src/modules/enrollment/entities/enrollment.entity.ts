import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Student } from '../../student/entities/student.entity';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  courseName!: string;

  @ManyToOne(() => Student, {
    eager: true,
    onDelete: 'CASCADE',
  })
  student!: Student;

  @CreateDateColumn()
  enrolledAt!: Date;
}