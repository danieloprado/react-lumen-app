export interface IProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: Date;
  updated_at: Date;
  experiences: IProfileExperience[];
  knowlogments: IProfileKnowlogment[];
}

export interface IProfileKnowlogment {
  id: number;
  profile_id: number;
  name: string;
  level: number;
}

export interface IProfileExperience {
  id: number;
  profile_id: number;
  company: string;
  started_at: Date;
  ended_at?: Date;
  description: string;
}