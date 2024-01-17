import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component'
import { routing } from './app.routing'
import { SideNavComponent } from './core/component/nav-bar/side-nav.component'
import { ToolbarComponent } from './core/component/toolbar/toolbar.component'
import { HttpInterceptorImpl } from './core/service/logInterceptor'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    routing,
    SideNavComponent,
    ToolbarComponent
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorImpl, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule {}
