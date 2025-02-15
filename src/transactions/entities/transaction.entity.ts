import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

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

  @OneToMany(
    () => TransactionContents,
    (transactionContent) => transactionContent.transaction,
    { cascade: true },
  )
  transactionContents: TransactionContents[];
}

@Entity()
export class TransactionContents {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal' })
  price: number;

  @ManyToOne(
    () => Transaction,
    (transaction) => transaction.transactionContents,
  )
  transaction: Transaction;

  @ManyToOne(() => Product, (product) => product.transactionContents)
  product: Product;
}
