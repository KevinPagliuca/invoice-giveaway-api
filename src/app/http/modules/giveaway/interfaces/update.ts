import { Matches } from 'class-validator';
import { DateRegex } from '../../../../shared/validators';
import { NullOptional } from '../../../decorators/null-optional.decorator';

export class UpdateGiveawayDTO {
  @Matches(DateRegex, { message: 'Formato de data inválida, Exemplo: YYYY-MM-DD ou YYYY/MM/DD' })
  @NullOptional()
  endDate: string;
}
