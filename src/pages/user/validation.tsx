// src/pages/user/validation.ts
import { UserDto } from '../../helpers/dto';

type Errors = Partial<Record<keyof UserDto, string>> & { form?: string };

const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
// допускаем "123", "123.45", "123,45"
const decimalRx = /^\d+([.,]\d+)?$/;

export default function validate(values: UserDto): Errors {
  const errors: Errors = {};

  // email: обязателен + формат
  if (!values.email || String(values.email).trim() === '') {
    errors.email = 'Введите email';
  } else if (!emailRx.test(String(values.email).trim())) {
    errors.email = 'Некорректный email';
  }

  // password: обязателен только при создании (когда нет userId)
  const isCreate = !values.userId; // в Edit ты передаёшь userId
  if (isCreate) {
    if (!values.password || String(values.password).trim() === '') {
      errors.password = 'Введите пароль';
    } else if (String(values.password).length < 4) {
      errors.password = 'Минимум 4 символа';
    }
  }
  // при редактировании пустой пароль допускаем (значит "не менять")

  // balance: если задан — должен быть числом/десятичным
  if (
    values.balance !== undefined &&
    values.balance !== null &&
    String(values.balance).trim() !== '' &&
    !decimalRx.test(String(values.balance).trim())
  ) {
    errors.balance = 'Только число (пример: 100 или 100.50)';
  }

  // name валидировать не нужно — пустое превратишь в null перед отправкой

  return errors;
}
