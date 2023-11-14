import { Component, effect } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from './auth/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Capital Compass'
  public isAuthenticated = this.authService.isAuthenticated

  public constructor(
    private readonly authService: AuthService,
    private router: Router
  ) {
    effect(() => {
      if (this.isAuthenticated() == false) {
        this.router.navigate(['/'])
      }
    })
  }

  public ngOnInit(): void {
    this.authService.initAuthentication()
  }
}
