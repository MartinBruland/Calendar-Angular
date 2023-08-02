import { Component, Output, Input, EventEmitter, OnInit } from "@angular/core"

@Component({
	selector: "app-notification",
	templateUrl: "./notification.component.html",
	styleUrls: ["./notification.component.scss"]
})
export class NotificationComponent implements OnInit {
	@Input() message: string | undefined

	@Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>()

	ngOnInit(): void {
		setTimeout(() => {
			this.onCloseHandler()
		}, 3000)
	}

	onCloseHandler() {
		this.onClose.emit(false)
	}
}
