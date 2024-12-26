import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  //? usando el Pipe sin personalizar el mensaje
  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.categoriesService.findOne(id);
  // }

  //? Usando el Pipe personalizando el mensaje
  // @Get(':id')
  // findOne(@Param('id', new ParseIntPipe({exceptionFactory:() => new BadRequestException('ID no válido') })) id: number) {
  //   return this.categoriesService.findOne(id);
  // }

  //*Creando nuestro propio pipe para reutilizarlo
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({exceptionFactory:() => new BadRequestException('ID no válido') })) id: number) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoriesService.remove(id);
  }
}
