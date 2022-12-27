import { NullOptional } from 'app/http/decorators/null-optional.decorator';
import { DateRegex } from 'app/shared/validators';
import { Matches } from 'class-validator';

export class UpdateGiveawayDTO {
  @Matches(DateRegex, { message: 'Formato de data inválida, Exemplo: YYYY-MM-DD ou YYYY/MM/DD' })
  @NullOptional()
  endDate: string;
}
