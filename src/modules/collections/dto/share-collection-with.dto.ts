import { IsArray, ArrayNotEmpty, IsEmail } from 'class-validator';

export class ShareCollectionWithDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEmail({}, { each: true })
  readonly emails: string[];
}
