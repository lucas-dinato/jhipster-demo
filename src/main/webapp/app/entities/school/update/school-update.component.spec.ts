jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SchoolService } from '../service/school.service';
import { ISchool, School } from '../school.model';

import { SchoolUpdateComponent } from './school-update.component';

describe('Component Tests', () => {
  describe('School Management Update Component', () => {
    let comp: SchoolUpdateComponent;
    let fixture: ComponentFixture<SchoolUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let schoolService: SchoolService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SchoolUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SchoolUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SchoolUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      schoolService = TestBed.inject(SchoolService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const school: ISchool = { id: 456 };

        activatedRoute.data = of({ school });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(school));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const school = { id: 123 };
        spyOn(schoolService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ school });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: school }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(schoolService.update).toHaveBeenCalledWith(school);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const school = new School();
        spyOn(schoolService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ school });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: school }));
        saveSubject.complete();

        // THEN
        expect(schoolService.create).toHaveBeenCalledWith(school);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const school = { id: 123 };
        spyOn(schoolService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ school });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(schoolService.update).toHaveBeenCalledWith(school);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
