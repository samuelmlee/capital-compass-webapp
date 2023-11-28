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
    private _authService: AuthService,
    private _router: Router
  ) {
    effect(() => {
      if (!this._authService.user.value()) {
        this._router.navigate(['/'])
      }
    })
  }

  public ngOnInit(): void {
    this._authService.authenticate()
  }
}
