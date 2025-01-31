import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { Repository } from 'typeorm';
import { categories } from './data/categories';
import { products } from './data/products';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}
  async seed() {
    //?Provisional
    await this.categoryRepository.manager.query('TRUNCATE TABLE category RESTART IDENTITY CASCADE');

    await this.productRepository.delete({});
    await this.categoryRepository.save(categories);

    for await (const seedProduct of products) {
      const category = await this.categoryRepository.findOneBy({
        id: seedProduct.categoryId,
      });
      console.log(category,'hola');
      
      const product = await this.productRepository.create(seedProduct);
      product.category = category;
      await this.productRepository.save(product);
      console.log(product);
    }
  }
}
