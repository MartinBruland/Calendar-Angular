import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { CalendarComponent } from "../components/calendar/calendar.component";
import { ListComponent } from '../components/list/list.component';
import { ActionsComponent } from '../components/actions/actions.component';
import { LoginComponent } from '../components/login/login.component';
import { SettingsComponent } from '../components/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    ListComponent,
    ActionsComponent,
    LoginComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
