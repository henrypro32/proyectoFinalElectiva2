import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.min.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('estudiantes-fronted');
}
