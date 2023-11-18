import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component'
import { routing } from './app.routing'
import { NavBarComponent } from './core/component/nav-bar/nav-bar.component'
import { ToolbarComponent } from './core/component/toolbar/toolbar.component'
import { HttpInterceptorImpl } from './core/service/logInterceptor'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, routing, NavBarComponent, ToolbarComponent],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorImpl, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
