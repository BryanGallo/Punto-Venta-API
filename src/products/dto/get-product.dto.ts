import { IsNumberString, IsOptional } from 'class-validator';

export class GetProductDto {
  @IsOptional({})
  @IsNumberString({},{message:"La categoria debe ser un numero"})
  category_id?: number;

  @IsOptional({})
  @IsNumberString({},{message:"El límite debe ser un numero"})
  take?: number;

  @IsOptional({})
  @IsNumberString({},{message:"El salto debe ser un numero"})
  skip?: number;
}
