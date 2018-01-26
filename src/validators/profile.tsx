import { IProfile } from '../interfaces/profile';
import { BaseValidator } from './base';

export default class ProfileValidator extends BaseValidator<IProfile> {
  constructor() {
    super({
      id: 'integer|min:1',
      name: 'required|max:100',
      email: 'required|email|max:150',
      phone: 'max:11'
    });
  }
}