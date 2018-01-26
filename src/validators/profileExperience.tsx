import { IProfileExperience } from '../interfaces/profile';
import { BaseValidator } from './base';

export default class ProfileExperienceValidator extends BaseValidator<IProfileExperience> {
  constructor() {
    super({
      id: 'integer|min:1',
      company: 'required|max:100',
      started_at: 'required|date',
      ended_at: 'date|after:started_at',
      description: 'required|max:1000',
    });
  }
}