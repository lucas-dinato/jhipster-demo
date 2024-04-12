import { IStudent } from 'app/entities/student/student.model';

export interface ISchool {
  id?: number;
  name?: string;
  principal?: string | null;
  students?: IStudent[] | null;
}

export class School implements ISchool {
  constructor(public id?: number, public name?: string, public principal?: string | null, public students?: IStudent[] | null) {}
}

export function getSchoolIdentifier(school: ISchool): number | undefined {
  return school.id;
}
