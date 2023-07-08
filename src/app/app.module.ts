import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"

import { AppComponent } from "./app.component"
import { CalendarComponent } from "../components/calendar/calendar.component"
import { ListComponent } from "../components/list/list.component"
import { CalendarIconComponent } from "../components/calendar-icon/calendar-icon.component"

import { SettingsViewComponent } from "../components/settings-view/settings-view.component"
import { LoginViewComponent } from "../components/login-view/login-view.component"
import { UpdateViewComponent } from "../components/update-view/update-view.component"
import { NotificationComponent } from "../components/notification/notification.component"
import { LoadingIndicatorComponent } from "../components/loading-indicator/loading-indicator.component"

@NgModule({
	declarations: [
		AppComponent,
		CalendarComponent,
		ListComponent,
		LoginViewComponent,
		SettingsViewComponent,
		CalendarIconComponent,
		UpdateViewComponent,
		NotificationComponent,
		LoadingIndicatorComponent
	],
	imports: [BrowserModule, FormsModule, ReactiveFormsModule],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
