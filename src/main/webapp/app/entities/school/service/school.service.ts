import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISchool, getSchoolIdentifier } from '../school.model';

export type EntityResponseType = HttpResponse<ISchool>;
export type EntityArrayResponseType = HttpResponse<ISchool[]>;

@Injectable({ providedIn: 'root' })
export class SchoolService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/schools');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(school: ISchool): Observable<EntityResponseType> {
    return this.http.post<ISchool>(this.resourceUrl, school, { observe: 'response' });
  }

  update(school: ISchool): Observable<EntityResponseType> {
    return this.http.put<ISchool>(`${this.resourceUrl}/${getSchoolIdentifier(school) as number}`, school, { observe: 'response' });
  }

  partialUpdate(school: ISchool): Observable<EntityResponseType> {
    return this.http.patch<ISchool>(`${this.resourceUrl}/${getSchoolIdentifier(school) as number}`, school, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISchool>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISchool[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSchoolToCollectionIfMissing(schoolCollection: ISchool[], ...schoolsToCheck: (ISchool | null | undefined)[]): ISchool[] {
    const schools: ISchool[] = schoolsToCheck.filter(isPresent);
    if (schools.length > 0) {
      const schoolCollectionIdentifiers = schoolCollection.map(schoolItem => getSchoolIdentifier(schoolItem)!);
      const schoolsToAdd = schools.filter(schoolItem => {
        const schoolIdentifier = getSchoolIdentifier(schoolItem);
        if (schoolIdentifier == null || schoolCollectionIdentifiers.includes(schoolIdentifier)) {
          return false;
        }
        schoolCollectionIdentifiers.push(schoolIdentifier);
        return true;
      });
      return [...schoolsToAdd, ...schoolCollection];
    }
    return schoolCollection;
  }
}
