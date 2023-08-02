import { Component, Output, EventEmitter } from "@angular/core"
import { FormBuilder } from "@angular/forms"

@Component({
	selector: "login-view",
	templateUrl: "./login-view.component.html",
	styleUrls: ["./login-view.component.scss"]
})
export class LoginViewComponent {
	@Output() outputSubmit: EventEmitter<string> = new EventEmitter<string>()

	signInForm = new FormBuilder().group({
		email: ""
	})

	onSubmit() {
		const email = this.signInForm.value.email as string
		this.signInForm.reset()
		this.outputSubmit.emit(email)
	}
}
