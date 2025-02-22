import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {
  Transaction,
  TransactionContents,
} from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents)
    private readonly transactionContentsRepository: Repository<TransactionContents>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async create(createTransactionDto: CreateTransactionDto) {
    const { total, transactionContents } = createTransactionDto;

    await this.productRepository.manager.transaction(
      async (transactionEntityManager) => {
        const transaction = await transactionEntityManager.save(
          this.transactionRepository.create({ total }),
        );

        for await (const content of transactionContents) {
          const product = await transactionEntityManager.findOneBy(Product, {
            id: content.productId,
          });
          if (!product) {
            throw new NotFoundException(
              `Producto con ID ${content.productId} no encontrado`,
            );
          }

          if (content.quantity > product.inventory) {
            throw new BadRequestException(
              `El articulo ${product.name} excede la cantidad disponible`,
            );
          }

          product.inventory -= content.quantity;
          //haciendo persistente el cambio para no usar cascade
          await transactionEntityManager.save(product);

          const transactionContent =
            await this.transactionContentsRepository.create({
              ...content,
            });
          transactionContent.transaction = transaction;
          transactionContent.product = product;
          await transactionEntityManager.save(transactionContent);
        }
      },
    );

    return {
      msg: 'Venta almacenada Correctamenta',
    };
  }

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
