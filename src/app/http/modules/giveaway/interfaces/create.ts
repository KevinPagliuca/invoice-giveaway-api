import { IsNotEmpty, Matches } from 'class-validator';
import { DateRegex } from '../../../../shared/validators';

export class CreateGiveawayDTO {
  @IsNotEmpty({ message: 'A data de início é obrigatória' })
  @Matches(DateRegex, {
    message: 'Formato de data de início inválida, Exemplo: YYYY-MM-DD ou YYYY/MM/DD',
  })
  startDate: string;

  @IsNotEmpty({ message: 'A data de término é obrigatória' })
  @Matches(DateRegex, {
    message: 'Formato da data de término inválida, Exemplo: YYYY-MM-DD ou YYYY/MM/DD',
  })
  endDate: string;
}
