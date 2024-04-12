import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISchool, School } from '../school.model';
import { SchoolService } from '../service/school.service';

@Injectable({ providedIn: 'root' })
export class SchoolRoutingResolveService implements Resolve<ISchool> {
  constructor(protected service: SchoolService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISchool> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((school: HttpResponse<School>) => {
          if (school.body) {
            return of(school.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new School());
  }
}
