import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { DataSource, In, Repository } from 'typeorm';
import { categories } from './data/categories';
import { products } from './data/products';
import { Role } from '../roles/entities/role.entity';
import { User } from '../auth/entities/user.entity';
import { roles } from './data/roles';
import { users } from './data/users';
import { hashPassword } from '../common/utils/auth.util';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Role)
    private readonly rolRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private dataSource: DataSource,
  ) {}

  async seed() {
    await this.dataSource.dropDatabase();
    await this.dataSource.synchronize();
    console.log('Database reset completed!');

    //Insertar Tablas individuales
    await this.categoryRepository.save(categories);
    await this.rolRepository.save(roles);
    await this.userRepository.save(users);

    // Relacionar roles y usuarios
    for await (const seedUser of users) {
      const userRoles = await this.rolRepository.find({
        where: { id: In(seedUser.roleId) },
      });

      const user = await this.userRepository.create(seedUser);
      user.password = await hashPassword(user.password);
      user.roles = userRoles; // Asignar las entidades de roles al usuario
      await this.userRepository.save(user);
    }

    for await (const seedProduct of products) {
      const category = await this.categoryRepository.findOneBy({
        id: seedProduct.categoryId,
      });

      const user = await this.userRepository.findOneBy({
        id: seedProduct.userId,
      });

      const product = await this.productRepository.create(seedProduct);
      product.category = category;
      product.user = user;
      await this.productRepository.save(product);
    }

    console.log('Seed Completo');
  }
}
