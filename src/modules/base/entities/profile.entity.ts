import { Entity, Column, OneToMany } from 'typeorm';
import { Contract } from '../../contract/entities/contract.entity';
import { ProfileRole } from '../../../enums';
import { BaseTable } from '../../../database';

@Entity({ name: 'profiles' })
export class Profile extends BaseTable {
  @Column({ type: 'varchar', unique: true })
  uuid: string;

  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  profession: string;

  @Column({ type: 'decimal' })
  balance: number;

  @Column({ type: 'enum', enum: ProfileRole })
  role: ProfileRole;

  @OneToMany(() => Contract, contract => contract.contractor)
  contractsAsContractor: Contract[];

  @OneToMany(() => Contract, contract => contract.client)
  contractsAsClient: Contract[];
}
