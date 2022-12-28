import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  cpf: string;
  name: string;
  email: string;
  birthDate: Date;
  rg?: string | null;
  mainPhone: string;
  secondaryPhone?: string | null;
  zipCode: string;
  street: string;
  district: string;
  number: string;
  complement?: string | null;
  city: string;
  state: string;

  recoverPassCode?: string | null;

  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(user: UserEntity) {
    Object.assign(this, user);
  }
}
