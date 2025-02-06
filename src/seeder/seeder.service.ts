import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { categories } from './data/categories';
import { Role } from 'src/roles/entities/role.entity';
import { roles } from './data/roles';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Role)
    private readonly roleReporitory: Repository<Role>,
    @InjectRepository(Category)
    private readonly categoryReporitory: Repository<Category>,
    @InjectRepository(Product)
    private readonly productReporitory: Repository<Product>,
  ) {}
  async seed() {
    console.log('desde seed');
    await this.roleReporitory.create(roles);
    await this.categoryReporitory.create(categories);
  }
}
