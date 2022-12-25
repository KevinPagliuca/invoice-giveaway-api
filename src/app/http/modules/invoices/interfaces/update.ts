import { NullOptional } from 'app/http/decorators/null-optional.decorator';
import { CNPJRegex } from 'app/shared/validators';
import { IsNotEmpty, Matches, IsDateString, IsNumber } from 'class-validator';

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

  @IsNotEmpty({ message: 'A data de emissão é obrigatória' })
  @IsDateString({}, { message: 'Formato da data de emissão inválido' })
  @NullOptional()
  date: Date;

  @IsNotEmpty({ message: 'O valor total é obrigatório' })
  @IsNumber({}, { message: 'O valor total deve ser um número' })
  @NullOptional()
  totalValue: number;
}
