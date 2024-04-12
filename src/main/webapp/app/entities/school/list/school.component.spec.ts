import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SchoolService } from '../service/school.service';

import { SchoolComponent } from './school.component';

describe('Component Tests', () => {
  describe('School Management Component', () => {
    let comp: SchoolComponent;
    let fixture: ComponentFixture<SchoolComponent>;
    let service: SchoolService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SchoolComponent],
      })
        .overrideTemplate(SchoolComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SchoolComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SchoolService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.schools?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
