import { IsNotEmpty, Matches } from 'class-validator';
import { CPFRegex } from '../../../../shared/validators';

export class RecoverPasswordDTO {
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  @Matches(CPFRegex, {
    message: 'Formato do CPF inválido. Exemplo: 000.000.000-00',
  })
  cpf: string;
}

export class ResetPasswordDTO {
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  @Matches(CPFRegex, {
    message: 'Formato do CPF inválido. Exemplo: 000.000.000-00',
  })
  cpf: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;

  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  confirmation: string;

  @IsNotEmpty({ message: 'O código é obrigatório.' })
  code: string;
}
