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
import { FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { products } from '../seeder/data/products';

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
    const { transactionContents } = createTransactionDto;

    await this.productRepository.manager.transaction(
      async (transactionEntityManager) => {
        const total = createTransactionDto.transactionContents.reduce(
          (total, item) => total + item.quantity * item.price,
          0,
        );

        const transaction = await transactionEntityManager.save(
          this.transactionRepository.create({ total }),
        );

        for await (const content of transactionContents) {
          const product = await transactionEntityManager.findOneBy(Product, {
            id: content.productId,
          });

          let errors: string[] = [];
          if (!product) {
            errors.push(`Producto con ID ${content.productId} no encontrado`);
            throw new NotFoundException(errors);
          }

          if (content.quantity > product.inventory) {
            errors.push(
              `El articulo ${product.name} excede la cantidad disponible`,
            );
            throw new BadRequestException(errors);
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
    const options: FindManyOptions<Transaction> = {
      relations: {
        transactionContents: {
          product: {
            category: true,
          },
        },
      },
      order: {
        transactionDate: 'DESC',
      },
      select: {
        transactionContents: {
          quantity: true,
          price: true,
          product: {
            name: true,
            image: true,
            price: true,
            category: {
              name: true,
            },
          },
        },
      },
    };

    const transactions = this.transactionRepository.find(
      // relations: ['transactionContents'], //?Sintaxis clásica para relacion
      options,
    );
    return transactions;
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
