import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import {
  Transaction,
  TransactionContents,
} from './entities/transaction.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Transaction, TransactionContents, Product]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
