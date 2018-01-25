import { Observable } from 'rxjs';
import validator from 'validatorjs';

export interface IValidatorResult<T> {
  valid: boolean;
  errors?: { [key: string]: string };
  model: T;
}

export abstract class BaseValidator<T> {
  private rules: any;
  private messages: any = {
    same: 'A confirmação não coincide.',
    confirmed: 'A confirmação não coincide.',
    after: 'Deve ser depois que :after.',
    after_or_equal: 'Deve ser igual ou depois que :after_or_equal.',
    email: 'Inválido',
    date: 'Inválido',
    in: 'Inválido',
    integer: 'Inválido',
    min: {
      numeric: 'Valor mínimo :min',
      string: 'Mínimo :min caracteres'
    },
    max: {
      numeric: 'Valor máximo :max',
      string: 'Máximo :max caracteres'
    },
    required: 'Obrigatório',
    required_if: 'Obrigatório'
  };

  constructor(rules: any) {
    this.rules = rules;
  }

  public validate(model: any): Observable<IValidatorResult<T>> {
    const result = new validator(model || {}, this.rules, this.messages);

    if (result.passes()) {
      return Observable.of({ valid: true, model, errors: {} });
    }

    const allErrors = result.errors.all();
    const errors = Object.keys(allErrors).reduce<any>((acc, key) => {
      acc[key] = allErrors[key][0];
      return acc;
    }, {});
    return Observable.of({ valid: false, errors, model });
  }
}