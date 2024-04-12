import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISchool } from '../school.model';
import { SchoolService } from '../service/school.service';

@Component({
  templateUrl: './school-delete-dialog.component.html',
})
export class SchoolDeleteDialogComponent {
  school?: ISchool;

  constructor(protected schoolService: SchoolService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.schoolService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
