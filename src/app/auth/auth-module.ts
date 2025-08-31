import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { Login } from './login/login';
import { Register } from './register/register';
import { Profile } from './profile/profile';

const routes: Routes = [
  { path: '', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile }
];

@NgModule({
  imports: [
    CommonModule,
    Login,
    Register,
    Profile,
    RouterModule.forChild(routes)
  ]
})
export class AuthModule {}
