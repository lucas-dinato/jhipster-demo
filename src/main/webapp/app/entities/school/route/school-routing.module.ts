import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SchoolComponent } from '../list/school.component';
import { SchoolDetailComponent } from '../detail/school-detail.component';
import { SchoolUpdateComponent } from '../update/school-update.component';
import { SchoolRoutingResolveService } from './school-routing-resolve.service';

const schoolRoute: Routes = [
  {
    path: '',
    component: SchoolComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SchoolDetailComponent,
    resolve: {
      school: SchoolRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SchoolUpdateComponent,
    resolve: {
      school: SchoolRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SchoolUpdateComponent,
    resolve: {
      school: SchoolRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(schoolRoute)],
  exports: [RouterModule],
})
export class SchoolRoutingModule {}
