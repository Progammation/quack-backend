import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsIn,
  IsUppercase,
} from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  readonly name: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  readonly bio?: string;

  @IsOptional()
  readonly slug: string;

  @IsOptional()
  readonly userId: number;

  @IsOptional()
  @IsIn(['PUBLIC', 'PRIVATE', 'UNLISTED'])
  @IsUppercase()
  readonly visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
}
