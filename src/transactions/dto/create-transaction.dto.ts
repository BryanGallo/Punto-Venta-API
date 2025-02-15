import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsInt,
    IsNotEmpty,
    IsNumber,
    ValidateNested,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty({ message: 'El Total no puede ir vacio' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Total no válido' })
  total: number;

  @IsArray({ message: 'Contenido no valido' })
  @ArrayNotEmpty({ message: 'Los Contenidos no pueden ir vacios' })
  @ValidateNested() // Valida cada elemento del array
  @Type(() => TransactionContentsDto) // Especifica el tipo de los elementos
  transactionContents: TransactionContentsDto[];
}

export class TransactionContentsDto {
  @IsNotEmpty({ message: 'Cantidad no puede estar vacía' })
  @IsNumber({}, { message: 'Cantidad no válida' })
  quantity: number;

  @IsNotEmpty({ message: 'Precio no puede estar vacío' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Precio no válido' })
  price: number;

  @IsNumber({}, { message: 'Id no valido' })
  productId: number;
}
