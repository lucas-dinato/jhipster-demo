import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SchoolComponent } from './list/school.component';
import { SchoolDetailComponent } from './detail/school-detail.component';
import { SchoolUpdateComponent } from './update/school-update.component';
import { SchoolDeleteDialogComponent } from './delete/school-delete-dialog.component';
import { SchoolRoutingModule } from './route/school-routing.module';

@NgModule({
  imports: [SharedModule, SchoolRoutingModule],
  declarations: [SchoolComponent, SchoolDetailComponent, SchoolUpdateComponent, SchoolDeleteDialogComponent],
  entryComponents: [SchoolDeleteDialogComponent],
})
export class SchoolModule {}
