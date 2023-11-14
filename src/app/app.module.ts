import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { routing } from './app.routing'
import { LandingComponent } from './core/landing/landing.component'
import { ToolbarComponent } from './core/toolbar/toolbar.component'

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, routing, LandingComponent, ToolbarComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
