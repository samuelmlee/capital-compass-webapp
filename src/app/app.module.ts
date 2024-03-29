import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { RouteReuseStrategy } from '@angular/router'
import { AppComponent } from './app.component'
import { routing } from './app.routing'
import { SideNavComponent } from './core/component/side-nav/side-nav.component'
import { ToolbarComponent } from './core/component/toolbar/toolbar.component'
import { CustomRouteReuseStrategy } from './core/service/custom-route-reuse-strategy'
import { HttpRequestInterceptor } from './core/service/http-request-interceptor'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    routing,
    SideNavComponent,
    ToolbarComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ]
})
export class AppModule {}
