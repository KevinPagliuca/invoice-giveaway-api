import { IsNotEmpty, Matches } from 'class-validator';
import { UserEntity } from '../../../../../database/entities/user.entity';
import { CPFRegex } from '../../../../shared/validators';

export class AuthCredentialsDTO {
  @Matches(CPFRegex, {
    message: 'Formato do CPF inválido. Exemplo: 000.000.000-00',
  })
  @IsNotEmpty({ message: 'O CPF é obrigatório' })
  cpf: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;
}

export interface ICurrentUser {
  user: UserEntity;
  token: string;
}
