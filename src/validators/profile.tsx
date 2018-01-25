import { BaseValidator } from './base';

export default class ProfileValidator extends BaseValidator<any> {
  constructor() {
    super({
      id: 'integer|min:1',
      name: 'required|max:100',
      email: 'required|email|max:150',
      phone: 'max:11',
      experiences: 'array',
      'experiences.*.id': 'integer|min:1',
      'experiences.*.company': 'required|max:100',
      'experiences.*.started_at': 'required|date',
      'experiences.*.ended_at': 'date|after:experiences.*.started_at',
      'experiences.*.description': 'required|max:1000',
      knowlogments: 'array',
      'knowlogments.*.id': 'integer|min:1',
      'knowlogments.*.name': 'required|max:50',
      'knowlogments.*.level': 'integer|required|between:1,5',

    });
  }
}