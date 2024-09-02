import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { BaseTable } from '../../../database';
import { ContractStatus } from '../../../enums';
import { Profile } from '../../base/entities/profile.entity';
import { Job } from '../../job/entities/job.entity';

@Entity({ name: 'contracts' })
export class Contract extends BaseTable {
  @Column({ type: 'varchar', unique: true })
  uuid: string;

  @Column({ type: 'text' })
  terms: string;

  @Column({ type: 'enum', enum: ContractStatus })
  status: ContractStatus;

  @ManyToOne(() => Profile, profile => profile.contractsAsContractor)
  contractor: Profile;

  @ManyToOne(() => Profile, profile => profile.contractsAsClient)
  client: Profile;

  @OneToMany(() => Job, job => job.contract)
  jobs: Job[];
}
