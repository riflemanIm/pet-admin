// src/pages/user/validation.ts
import { UserDto } from '../../helpers/dto';

export interface UserError {
  email?: string;
  balance?: string;
}

export default function validate(values: UserDto): UserError {
  const errors: UserError = {};

  if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Wrong email format';
  }
  // balance приходит как Decimal→string; проверим, что это число (если задано)
  if (values.balance != null && String(values.balance).trim() !== '' && isNaN(Number(values.balance))) {
    errors.balance = 'Balance must be a number (string)';
  }

  return errors;
}
