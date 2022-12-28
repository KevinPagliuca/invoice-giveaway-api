import { IsOptional, IsNotEmpty, Matches } from 'class-validator';
import { CEPRegex, DateRegex } from '../../../../shared/validators';
import { NullOptional } from '../../../decorators/null-optional.decorator';

export class UpdateUserDTO {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @NullOptional()
  name: string;

  @NullOptional()
  @Matches(DateRegex, {
    message: 'Formato da data de nascimento inválido, Exemplo: YYYY-MM-DD ou YYYY/MM/DD',
  })
  birthDate: string;

  @IsOptional()
  rg?: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @NullOptional()
  mainPhone: string;

  @IsOptional()
  secondaryPhone?: string;

  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  @Matches(CEPRegex, {
    message: 'Formato do CEP inválido. Exemplo: 00000-000',
  })
  @NullOptional()
  zipCode: string;

  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  @NullOptional()
  street: string;

  @IsNotEmpty({ message: 'O número é obrigatório' })
  @NullOptional()
  number: string;

  @IsNotEmpty({ message: 'O bairro é obrigatório' })
  @NullOptional()
  district: string;

  @IsOptional()
  complement?: string;

  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  @NullOptional()
  city: string;

  @IsNotEmpty({ message: 'O estado é obrigatório' })
  @NullOptional()
  state: string;
}
