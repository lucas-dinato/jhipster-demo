import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISchool } from '../school.model';
import { SchoolService } from '../service/school.service';
import { SchoolDeleteDialogComponent } from '../delete/school-delete-dialog.component';

@Component({
  selector: 'jhi-school',
  templateUrl: './school.component.html',
})
export class SchoolComponent implements OnInit {
  schools?: ISchool[];
  isLoading = false;

  constructor(protected schoolService: SchoolService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.schoolService.query().subscribe(
      (res: HttpResponse<ISchool[]>) => {
        this.isLoading = false;
        this.schools = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISchool): number {
    return item.id!;
  }

  delete(school: ISchool): void {
    const modalRef = this.modalService.open(SchoolDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.school = school;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
