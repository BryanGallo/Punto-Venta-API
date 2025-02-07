import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { Repository } from 'typeorm';
import { categories } from './data/categories';
import { Role } from '../roles/entities/role.entity';
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
    // Vaciando tablas
    await this.roleReporitory.delete({});
    await this.categoryReporitory.delete({});

    // Insertando tablas individuales
    await this.roleReporitory.create(roles);
    await this.categoryReporitory.create(categories);
  }
}
