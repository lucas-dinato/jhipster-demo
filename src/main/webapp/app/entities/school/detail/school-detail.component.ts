import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISchool } from '../school.model';

@Component({
  selector: 'jhi-school-detail',
  templateUrl: './school-detail.component.html',
})
export class SchoolDetailComponent implements OnInit {
  school: ISchool | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ school }) => {
      this.school = school;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
