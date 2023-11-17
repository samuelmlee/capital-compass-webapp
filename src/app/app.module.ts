import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component'
import { routing } from './app.routing'
import { LandingComponent } from './core/component/landing/landing.component'
import { ToolbarComponent } from './core/component/toolbar/toolbar.component'
import { HttpInterceptorImpl } from './core/service/logInterceptor'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, routing, LandingComponent, ToolbarComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorImpl, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
