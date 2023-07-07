import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { ReactiveFormsModule } from "@angular/forms"

import { AppComponent } from "./app.component"
import { CalendarComponent } from "../components/calendar/calendar.component"
import { ListComponent } from "../components/list/list.component"
import { CalendarIconComponent } from "../components/calendar-icon/calendar-icon.component"

import { SettingsViewComponent } from "../components/settings-view/settings-view.component"
import { LoginViewComponent } from "../components/login-view/login-view.component"
import { UpdateViewComponent } from "../components/update-view/update-view.component"

@NgModule({
	declarations: [
		AppComponent,
		CalendarComponent,
		ListComponent,
		LoginViewComponent,
		SettingsViewComponent,
		CalendarIconComponent,
		UpdateViewComponent
	],
	imports: [BrowserModule, ReactiveFormsModule],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
