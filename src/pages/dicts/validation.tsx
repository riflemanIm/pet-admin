import { DictDto } from '../../helpers/dto';

type Errors = Partial<Record<keyof DictDto, string>>;

export default function validate(values: DictDto): Errors {
  const errors: Errors = {};
  if (values.name == null || String(values.name).trim() === '') {
    errors.name = 'Введите название';
  }
  return errors;
}
