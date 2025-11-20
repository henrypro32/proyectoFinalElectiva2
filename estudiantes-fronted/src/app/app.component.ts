import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <app-header></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  // Componente raíz minimal
}
