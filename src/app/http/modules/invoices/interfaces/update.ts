import { IsNotEmpty, Matches } from 'class-validator';
import { CNPJRegex, DateRegex } from '../../../../shared/validators';
import { NullOptional } from '../../../decorators/null-optional.decorator';

export class UpdateInvoiceDTO {
  @IsNotEmpty({ message: 'O CNPJ é obrigatório' })
  @Matches(CNPJRegex, {
    message: 'Formato do CNPJ inválido. Exemplo: 00.000.000/0000-00',
  })
  @NullOptional()
  cnpj: string;

  @IsNotEmpty({ message: 'O número da nota fiscal é obrigatório' })
  @NullOptional()
  number: string;

  @IsNotEmpty({ message: 'A data da NF é obrigatória' })
  @Matches(DateRegex, {
    message: 'Formato da data da NF inválido, Exemplo: YYYY-MM-DD ou YYYY/MM/DD',
  })
  @NullOptional()
  date: string;

  @IsNotEmpty({ message: 'O valor total é obrigatório' })
  @NullOptional()
  totalValue: string;
}
