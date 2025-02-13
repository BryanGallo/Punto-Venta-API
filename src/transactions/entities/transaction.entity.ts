import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  transactionDate: Date;
}
