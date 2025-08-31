import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CourseList } from './course-list/course-list';
import { CourseDetail } from './course-detail/course-detail';

const routes: Routes = [
  { path: '', component: CourseList },
  { path: ':id', component: CourseDetail }
];

@NgModule({
  imports: [
    CommonModule,
    CourseList,
    CourseDetail,
    RouterModule.forChild(routes)
  ]
})
export class CoursesModule {}
