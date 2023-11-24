import { Component, effect } from '@angular/core'
import { Router } from '@angular/router'
import { AuthService } from './auth/service/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'Capital Compass'

  public constructor(
    private readonly authService: AuthService,
    private router: Router
  ) {
    effect(() => {
      if (this.authService.getIsAuthenticated().value == false) {
        this.router.navigate(['/'])
      }
    })
  }

  public ngOnInit(): void {
    this.authService.authenticate()
  }
}
