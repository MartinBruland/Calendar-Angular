import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CalendarComponent } from "../components/calendar/calendar.component";
import { ListComponent } from '../components/list/list.component';
import { ActionsComponent } from '../components/actions/actions.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    ListComponent,
    ActionsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
