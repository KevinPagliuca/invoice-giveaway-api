import { CNPJRegex } from 'app/shared/validators';
import { IsDateString, IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class CreateInvoiceDTO {
  @IsNotEmpty({ message: 'O CNPJ é obrigatório' })
  @Matches(CNPJRegex, {
    message: 'Formato do CNPJ inválido. Exemplo: 00.000.000/0000-00',
  })
  cnpj: string;

  @IsNotEmpty({ message: 'O número da nota fiscal é obrigatório' })
  number: string;

  @IsNotEmpty({ message: 'A data de emissão é obrigatória' })
  @IsDateString({}, { message: 'Formato da data de emissão inválido' })
  date: Date;

  @IsNotEmpty({ message: 'O valor total é obrigatório' })
  @IsNumber({}, { message: 'O valor total deve ser um número' })
  totalValue: number;
}
