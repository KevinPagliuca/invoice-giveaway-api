import { NullOptional } from 'app/http/decorators/null-optional.decorator';
import { CEPRegex } from 'app/shared/validators';
import { IsDateString, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @NullOptional()
  name: string;

  @IsDateString({}, { message: 'Formato da data de nascimento inválido' })
  @NullOptional()
  birthDate: Date;

  @IsNotEmpty()
  @IsOptional()
  rg?: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  @NullOptional()
  cellphone: string;

  @IsNotEmpty()
  @IsOptional()
  cellphone_secondary?: string;

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

  @IsNotEmpty({
    message: 'O bairro é obrigatório',
  })
  @NullOptional()
  district: string;

  @IsNotEmpty()
  @IsOptional()
  @NullOptional()
  complement?: string;

  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  @NullOptional()
  city: string;

  @IsNotEmpty({ message: 'O estado é obrigatório' })
  @NullOptional()
  state: string;
}
