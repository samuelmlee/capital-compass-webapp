import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { HttpClientModule } from '@angular/common/http'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { AppComponent } from './app.component'
import { routing } from './app.routing'
import { SideNavComponent } from './core/component/side-nav/side-nav.component'
import { ToolbarComponent } from './core/component/toolbar/toolbar.component'

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
  bootstrap: [AppComponent]
})
export class AppModule {}
