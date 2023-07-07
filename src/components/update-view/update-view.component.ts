import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core"
import { FormBuilder, FormControl } from "@angular/forms"
import { EventValidated } from "src/app/supabase.service"

@Component({
	selector: "update-view",
	templateUrl: "./update-view.component.html",
	styleUrls: ["./update-view.component.scss"]
})
export class UpdateViewComponent implements OnInit {
	labelUpdate = "Update Item"
	labelSave = "Save"
	labelDelete = "Delete"
	labelName = "Title: "
	labelDescription = "Description: "
	labelTag = "Category: "
	labelStartDate = "Start Date: "
	labelEndDate = "End Date: "

	@Input() inputEvent!: EventValidated
	@Output() outputSave: EventEmitter<EventValidated> =
		new EventEmitter<EventValidated>()
	@Output() outputDelete: EventEmitter<EventValidated> =
		new EventEmitter<EventValidated>()
	@Output() outputClose: EventEmitter<boolean> = new EventEmitter<boolean>()

	updateEventForm = new FormBuilder().group({
		title: new FormControl<string | undefined>(undefined, {
			nonNullable: true
		}),
		description: new FormControl<string | undefined>(undefined, {
			nonNullable: true
		}),
		category: new FormControl<string | undefined>(undefined, {
			nonNullable: true
		}),
		startDate: new FormControl<Date | undefined>(undefined, {
			nonNullable: true
		}),
		endDate: new FormControl<Date | undefined>(undefined, {
			nonNullable: true
		})
	})

	ngOnInit(): void {
		this.updateEventForm.patchValue({
			title: this.inputEvent.title,
			description: this.inputEvent.description,
			category: this.inputEvent.tag,
			startDate: this.inputEvent.date_start,
			endDate: this.inputEvent.date_end
		})
	}

	onSaveHandler() {
		if (this.updateEventForm.value.title === undefined) {
			return
		}

		const updatedObj: EventValidated = {
			...this.inputEvent,
			title: this.updateEventForm.value.title,
			description: this.updateEventForm.value.description,
			tag: this.updateEventForm.value.category,
			date_start: this.updateEventForm.value.startDate,
			date_end: this.updateEventForm.value.endDate
		}

		this.updateEventForm.reset()

		this.outputSave.emit(updatedObj)
	}

	onDeleteHandler() {
		this.outputDelete.emit(this.inputEvent)
	}

	onCloseViewHandler() {
		this.outputClose.emit(true)
	}
}
