import { ValidateIf } from 'class-validator';

export const NullOptional = () => ValidateIf((_, value) => !!value);
