jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISchool, School } from '../school.model';
import { SchoolService } from '../service/school.service';

import { SchoolRoutingResolveService } from './school-routing-resolve.service';

describe('Service Tests', () => {
  describe('School routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SchoolRoutingResolveService;
    let service: SchoolService;
    let resultSchool: ISchool | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SchoolRoutingResolveService);
      service = TestBed.inject(SchoolService);
      resultSchool = undefined;
    });

    describe('resolve', () => {
      it('should return ISchool returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSchool = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSchool).toEqual({ id: 123 });
      });

      it('should return new ISchool if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSchool = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSchool).toEqual(new School());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSchool = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSchool).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
