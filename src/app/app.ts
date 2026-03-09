import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf, NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

/**
 * Root AppComponent — hosts the app shell layout:
 * - Fixed top header with L&T branding and HR mode toggle
 * - Side navigation bar
 * - Router outlet for page content
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  /** Observable HR mode state — drives sidenav guard indicator and header toggle */
  isHR$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isHR$ = this.authService.isHR$;
  }

  /** Toggle between HR and Employee access roles */
  toggleHRMode(): void {
    this.authService.toggleHRMode();
  }
}
