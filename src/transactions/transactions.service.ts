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
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';

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

  async findAll(transactionDate?: string) {
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
    if (transactionDate) {
      const date = parseISO(transactionDate);
      console.log(date);
      if (!isValid(date)) {
        throw new BadRequestException('Fecha no valida');
      }

      //?Obteniendo inicio y final de fechas
      const startDate = startOfDay(date);
      const endDate = endOfDay(date);

      options.where = {
        transactionDate: Between(startDate, endDate),
      };
    }

    const transactions = await this.transactionRepository.find(
      // relations: ['transactionContents'], //?Sintaxis clásica para relacion
      options,
    );
    return transactions;
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      relations: {
        transactionContents: true,
      },
      where: {
        id,
      },
    });

    if (!transaction) {
      let errors: string[] = [];
      errors.push(`La transaccion número ${id} no encontrado`);
      throw new NotFoundException(errors);
    }

    return transaction;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  async remove(id: number) {
    const transactionContents = await this.transactionContentsRepository.find({
      relations: {
        product: true,
      },
      where: {
        transaction: {
          id,
        },
      },
    });

    const transaction = await this.findOne(id);

    //* Restableciendo Stock de productos antes de eliminar las transacciones
    for await (const content of transactionContents) {
      const product = await this.productRepository.findOneBy({
        id: content.product.id,
      });
      product.inventory += content.quantity;
      await this.productRepository.save(product);
    }

    await this.transactionContentsRepository.remove(transactionContents);
    await this.transactionRepository.remove(transaction);

    return `La transaccion número #${id} fue eliminado`;
  }
}
