import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const category = await this.categoryRepository.findOneBy({
      id: createProductDto.categoryId,
    });

    if (!category) {
      let errors: string[] = [];
      errors.push('La categoria no existe');
      throw new NotFoundException(errors);
    }

    return this.productRepository.save({
      ...createProductDto,
      category,
    });
  }

  async findAll(categoryId: number, take: number) {
    //* Generamos una variable que tendra los filtros de la condicion de la consulta

    const options: FindManyOptions<Product> = {
      relations: {
        category: true,
      },
      order: {
        id: 'DESC',
      },
      take: take,
    };

    if (categoryId) {
      options.where = {
        category: {
          id: categoryId,
        },
      };
    }

    //? Metodo convencional para traer la relacion con categorias aunque es un metodo mas eficiente (REVISA LA VARIABLE options)
    const [products, total] =
      await this.productRepository.findAndCount(options);

    //* SI colocamos "eager" en nuestra relacion de nuestro entity ya con find nos traera nuestra relacion
    // const products = await this.productRepository.find()

    //* Si nuestro proyecto usa eager: true pero por ab razon necesitamos en un punto desactivarlo podemos usar loadEagerRelations
    // const products = await this.productRepository.find({
    //   loadEagerRelations: false,
    // });

    return { products, total };
  }

  async findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
