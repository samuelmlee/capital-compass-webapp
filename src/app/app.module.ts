import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component'
import { routing } from './app.routing'
import { LandingComponent } from './core/component/landing/landing.component'
import { ToolbarComponent } from './core/component/toolbar/toolbar.component'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, routing, LandingComponent, ToolbarComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
