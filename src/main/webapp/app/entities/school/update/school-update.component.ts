import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ISchool, School } from '../school.model';
import { SchoolService } from '../service/school.service';

@Component({
  selector: 'jhi-school-update',
  templateUrl: './school-update.component.html',
})
export class SchoolUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.minLength(3)]],
    principal: [],
  });

  constructor(protected schoolService: SchoolService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ school }) => {
      this.updateForm(school);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const school = this.createFromForm();
    if (school.id !== undefined) {
      this.subscribeToSaveResponse(this.schoolService.update(school));
    } else {
      this.subscribeToSaveResponse(this.schoolService.create(school));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISchool>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(school: ISchool): void {
    this.editForm.patchValue({
      id: school.id,
      name: school.name,
      principal: school.principal,
    });
  }

  protected createFromForm(): ISchool {
    return {
      ...new School(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      principal: this.editForm.get(['principal'])!.value,
    };
  }
}
