import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnChanges,
	SimpleChanges
} from "@angular/core"
import { EventValidated } from "../../app/supabase.service"

@Component({
	selector: "app-actions",
	templateUrl: "./actions.component.html",
	styleUrls: ["./actions.component.scss"]
})
export class ActionsComponent implements OnChanges {
	labelTitle = "Filters"

	@Input() inputEvents: EventValidated[] | undefined

	@Output() outputTag: EventEmitter<string> = new EventEmitter<string>()

	defaultTags = ["All", "Completed"]

	availableTags = this.defaultTags

	selectedTag = this.defaultTags[0]

	ngOnChanges(changes: SimpleChanges): void {
		const updatedEvents: EventValidated[] = changes["inputEvents"].currentValue

		const updatedTags = updatedEvents
			.map(event => event.tag)
			.filter(tag => tag !== undefined) as string[]

		const allTags = [...new Set([...this.defaultTags, ...updatedTags])]

		if (!allTags.includes(this.selectedTag))
			this.onSelectHandler(this.defaultTags[0])

		this.availableTags = allTags
	}

	onSelectHandler(val: string) {
		this.selectedTag = val
		this.outputTag.emit(val)
	}
}
