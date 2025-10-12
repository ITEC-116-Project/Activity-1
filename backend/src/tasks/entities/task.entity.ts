import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500 })
  text: string;

  @Column({ type: 'datetime' })
  taskTime: Date;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  addedOn: Date;

  @UpdateDateColumn({ nullable: true })
  editedOn: Date;
}