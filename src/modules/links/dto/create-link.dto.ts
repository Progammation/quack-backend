import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateLinkDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl()
  readonly url: string;

  @IsNumberString()
  @IsOptional()
  readonly collectionId: number;
}
