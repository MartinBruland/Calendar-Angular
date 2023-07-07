import { Component, Input, Output, EventEmitter } from "@angular/core"
import { EventValidated } from "../../app/supabase.service"
import { FormBuilder, FormControl } from "@angular/forms"

@Component({
	selector: "app-list",
	templateUrl: "./list.component.html",
	styleUrls: ["./list.component.scss"]
})
export class ListComponent {
	labelTitle = "Events"
	labelAdd = "+"

	@Input() inputEvents!: EventValidated[]

	@Input() inputSelectedDate: Date | undefined

	@Input() inputSelectedTag: string | undefined

	@Output() outputOpenUpdateView: EventEmitter<boolean> =
		new EventEmitter<boolean>()

	@Output() outputSelectEvent: EventEmitter<EventValidated> =
		new EventEmitter<EventValidated>()

	@Output() outputUpdateEvent: EventEmitter<EventValidated> =
		new EventEmitter<EventValidated>()

	@Output() outputAddEvent: EventEmitter<EventValidated> =
		new EventEmitter<EventValidated>()

	addEventForm = new FormBuilder().group({
		title: new FormControl<string | undefined>(undefined, {
			nonNullable: true
		})
	})

	onSelectHandler(id: string) {
		const found = this.inputEvents.find(item => item.id === id)
		if (found) {
			this.outputSelectEvent.emit(found)
			this.outputOpenUpdateView.emit(true)
		}
	}

	onCheckedHandler(event: Event) {
		const key = (event.target as HTMLInputElement).id
		const value = (event.target as HTMLInputElement).checked

		const item = this.inputEvents.find(item => String(item.id) === String(key))

		if (item) {
			const obj: EventValidated = {
				...item,
				status: value
			}

			this.outputUpdateEvent.emit(obj)
		}
	}

	onCreateHandler() {
		const title = this.addEventForm.value.title

		if (!title) return

		const selectedDate = this.inputSelectedDate
			? this.inputSelectedDate
			: new Date()

		const defaultTag = "All"

		const defaultStatus = false

		const obj: EventValidated = {
			date_created: new Date(),
			title: title,
			tag: defaultTag,
			date_start: selectedDate,
			status: defaultStatus
		}

		this.addEventForm.reset()

		this.outputAddEvent.emit(obj)
	}

	getFilteredItems() {
		const originalEvents: EventValidated[] = this.inputEvents
		let filteredEvents: EventValidated[] = []

		if (!this.inputSelectedTag || this.inputSelectedTag === "All") {
			filteredEvents = originalEvents
		}

		if (this.inputSelectedTag === "Completed") {
			filteredEvents = this.filterItemsByStatus(true, originalEvents)
		}

		if (
			this.inputSelectedTag &&
			this.inputSelectedTag !== "All" &&
			this.inputSelectedTag !== "Completed"
		) {
			filteredEvents = this.filterItemsByTag(this.inputSelectedTag, originalEvents)
		}

		if (this.inputSelectedTag && this.inputSelectedDate) {
			filteredEvents = this.filterItemsByDate(
				this.inputSelectedDate,
				filteredEvents
			)
		}

		if (!this.inputSelectedTag && this.inputSelectedDate) {
			filteredEvents = this.filterItemsByDate(
				this.inputSelectedDate,
				originalEvents
			)
		}

		return filteredEvents
	}

	filterItemsByTag(val: string, data: EventValidated[]) {
		return [...data].filter(item => item.tag === val)
	}

	filterItemsByDate(val: Date, data: EventValidated[]) {
		return [...data].filter(
			item =>
				item.date_start &&
				item.date_start.getDate() === val.getDate() &&
				item.date_start.getMonth() === val.getMonth() &&
				item.date_start.getFullYear() === val.getFullYear()
		)
	}

	filterItemsByStatus(val: boolean, data: EventValidated[]) {
		return [...data].filter(item => item.status === val)
	}

	formatDate(date: Date | undefined) {
		if (!date) return
		const year = date.getFullYear()
		const month = String(date.getMonth() + 1).padStart(2, "0")
		const day = String(date.getDate()).padStart(2, "0")
		return `${year}-${month}-${day}`
	}
}
