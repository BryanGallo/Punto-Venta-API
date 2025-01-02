import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from 'src/categories/entities/category.entity';

export class CreateProductDto {
  @IsString({ message: 'Nombre no valido' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Precio no valido' })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  price: number;

  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Cantidad no valido' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsNumber()
  inventory: number;

  //? colocamos el nombre de la columna que se creo en la tabla en este caso categoryId
  @IsInt({ message: 'Categoría no valida' })
  @IsNotEmpty({ message: 'La categorría es obligatoria' })
  categoryId: Category;
}
