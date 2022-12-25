import { CEPRegex, CPFRegex } from 'app/shared/validators';
import { IsDateString, IsEmail, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  @Matches(CPFRegex, {
    message: 'Formato do CPF inválido. Exemplo: 000.000.000-00',
  })
  cpf: string;

  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Formato do e-mail inválido' })
  email: string;

  @IsDateString({}, { message: 'Formato da data de nascimento inválido' })
  @IsNotEmpty({ message: 'A data de nascimento é obrigatória' })
  birthDate: Date;

  @IsNotEmpty()
  @IsOptional()
  rg?: string;

  @IsNotEmpty({ message: 'O telefone é obrigatório' })
  cellphone: string;

  @IsNotEmpty()
  @IsOptional()
  cellphone_secondary?: string;

  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  @Matches(CEPRegex, {
    message: 'Formato do CEP inválido. Exemplo: 00000-000',
  })
  zipCode: string;

  @IsNotEmpty({ message: 'O endereço é obrigatório' })
  street: string;

  @IsNotEmpty({ message: 'O número é obrigatório' })
  number: string;

  @IsNotEmpty({
    message: 'O bairro é obrigatório',
  })
  district: string;

  @IsNotEmpty()
  @IsOptional()
  complement?: string;

  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  city: string;

  @IsNotEmpty({ message: 'O estado é obrigatório' })
  state: string;

  @IsNotEmpty({
    message: 'A senha é obrigatória',
  })
  password: string;
}
