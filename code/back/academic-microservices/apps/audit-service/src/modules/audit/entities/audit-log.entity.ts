import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  eventType!: string;

  @Column({
    type: 'jsonb',
  })
  payload!: Record<string, unknown>;

  @CreateDateColumn()
  processedAt!: Date;
}