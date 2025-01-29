import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from '../auth/decorator/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.enum';
import { IdValidationPipe } from '../common/pipes/id-validation/id-validation.pipe';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
// @Auth() //? si queremos que todas la rutas requieran autenticacion
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Auth()
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
  @Auth()
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.superAdmin, ValidRoles.admin)
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.categoriesService.remove(+id);
  }
}
