import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);

    return category;
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findOne(id: number) {
    //? findOne para consultas complicadas por ejemplo
    // const category = await this.categoryRepository.findOne({
    //   where: { id },
    // });
    //? findOneBy para consultas basicas
    const category = await this.categoryRepository.findOneBy({ id });

    //TODO: Validando si existe la categoria
    if (!category) {
      //? Devolviendo de una manera generica se debe colocar el codigo del status que deseamos retornar
      // throw new HttpException(`La categoria con el id ${id} no existe`, 404);
      //* Usando HTTP exceptions ya otorgados por nest
      throw new NotFoundException(`La categoria con el id ${id} no existe`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    //? realizando paso a paso
    // const category = await this.findOne(id);

    // category.nombre = updateCategoryDto.nombre;

    // await this.categoryRepository.save(category);
    // return `La categoria con el id ${id} fue actualizada`;

    //* Usando Update

    await this.categoryRepository.update(id, updateCategoryDto);
    return `La categoria con el id ${id} fue actualizada`;
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    //? Eliminación lógica y te indica cual elimino
    await this.categoryRepository.remove(category);

    //? Eliminación física y solo te indica el numero de filas afectadas
    // await this.userRepository.delete(id);

    return `La categoría ${id} fue eliminada correctamenta`;
  }
}
