import { CPFRegex } from 'app/shared/validators';
import { IsString, Matches } from 'class-validator';
import { UserEntity } from 'database/Entities/user.entity';

export class AuthCredentialsDTO {
  @Matches(CPFRegex, {
    message: 'Formato do CPF inválido. Exemplo: 000.000.000-00',
  })
  @IsString({ message: 'O CPF é obrigatório' })
  cpf: string;

  @IsString({ message: 'A senha é obrigatória' })
  password: string;
}

export interface ICurrentUser {
  user: UserEntity;
  token: string;
}
