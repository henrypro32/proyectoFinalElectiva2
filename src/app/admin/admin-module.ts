import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { Dashboard } from './dashboard/dashboard';
import { UserManagement } from './user-management/user-management';
import { ContentApproval } from './content-approval/content-approval';

const routes: Routes = [
  { path: '', component: Dashboard },
  { path: 'users', component: UserManagement },
  { path: 'approval', component: ContentApproval }
];

@NgModule({
  imports: [
    CommonModule,
    Dashboard,
    UserManagement,
    ContentApproval,
    RouterModule.forChild(routes)
  ]
})
export class AdminModule {}
