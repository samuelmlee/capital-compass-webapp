import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Capital Compass';
  public constructor(private readonly authService: AuthService) {}

  public ngOnInit(): void {
    this.authService.initAuthentication();
  }
}
