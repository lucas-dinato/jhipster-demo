import { ISchool } from 'app/entities/school/school.model';
import { Language } from 'app/entities/enumerations/language.model';

export interface IStudent {
  id?: number;
  firstName?: string;
  lastName?: string;
  email?: string | null;
  age?: number | null;
  language?: Language | null;
  school?: ISchool | null;
}

export class Student implements IStudent {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string | null,
    public age?: number | null,
    public language?: Language | null,
    public school?: ISchool | null
  ) {}
}

export function getStudentIdentifier(student: IStudent): number | undefined {
  return student.id;
}
