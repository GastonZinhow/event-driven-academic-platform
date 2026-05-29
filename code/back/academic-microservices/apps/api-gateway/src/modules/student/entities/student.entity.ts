import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    length: 120,
  })
  name!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;
}