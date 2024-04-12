import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SchoolDetailComponent } from './school-detail.component';

describe('Component Tests', () => {
  describe('School Management Detail Component', () => {
    let comp: SchoolDetailComponent;
    let fixture: ComponentFixture<SchoolDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SchoolDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ school: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SchoolDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SchoolDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load school on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.school).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
