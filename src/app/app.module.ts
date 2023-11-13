import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { HttpClientModule } from '@angular/common/http'
import { MatButtonModule } from '@angular/material/button'
import { MatToolbarModule } from '@angular/material/toolbar'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ToolbarComponent } from './core/toolbar/toolbar.component'

@NgModule({
  declarations: [AppComponent, ToolbarComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatToolbarModule,
    MatButtonModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
