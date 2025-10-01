import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UploadForm } from './upload-form/upload-form';
import { FileList } from './file-list/file-list';
import { FileDetail } from './file-detail/file-detail';
import { MyUploads } from './my-uploads/my-uploads';
import { SearchFilters } from './search-filters/search-filters';

const routes: Routes = [
  { path: '', component: FileList },
  { path: 'upload', component: UploadForm },
  { path: 'my-uploads', component: MyUploads },
  { path: ':id', component: FileDetail }
];

@NgModule({
  imports: [
    CommonModule,
    UploadForm,
    FileList,
    FileDetail,
    MyUploads,
    SearchFilters,
    RouterModule.forChild(routes)
  ]
})
export class LibraryModule {}
