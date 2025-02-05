import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { categories } from './data/categories';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryReporitory: Repository<Category>,
    @InjectRepository(Product)
    private readonly productReporitory: Repository<Product>,
  ) {}
  async seed() {
    console.log('desde seed');

    await this.categoryReporitory.create(categories);
  }
}
