import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseTable } from '../../../database';
import { Contract } from '../../contract/entities/contract.entity';

@Entity({ name: 'jobs' })
export class Job extends BaseTable {
  @Column({ type: 'varchar', unique: true })
  uuid: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal' })
  price: number;

  @Column({ type: 'boolean' })
  isPaid: boolean;

  @Column({ type: 'date', nullable: true })
  paidDate: Date | null;

  @ManyToOne(() => Contract, contract => contract.jobs)
  contract: Contract;
}
