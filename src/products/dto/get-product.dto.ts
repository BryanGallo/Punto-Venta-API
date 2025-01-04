import { IsNumberString, IsOptional } from 'class-validator';

export class GetProduct {
  @IsOptional({})
  @IsNumberString({},{message:"La categoria debe ser un numero"})
  category_id?: number;
}
