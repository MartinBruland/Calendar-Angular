import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core"
import { FormBuilder } from "@angular/forms"
import { Profile } from "../../app/supabase.service"
import { SafeResourceUrl } from "@angular/platform-browser"

export interface Upload {
	file: File
	filepath: string
}

@Component({
	selector: "settings-view",
	templateUrl: "./settings-view.component.html",
	styleUrls: ["./settings-view.component.scss"]
})
export class SettingsViewComponent implements OnInit {
	@Input() inputProfile: Profile | undefined
	@Input() inputAvatarURL: SafeResourceUrl | undefined

	@Output() outputSave: EventEmitter<Profile> = new EventEmitter<Profile>()
	@Output() outputUpload: EventEmitter<Upload> = new EventEmitter<Upload>()

	updateProfileForm = new FormBuilder().group({
		first_name: "",
		last_name: ""
	})

	async ngOnInit(): Promise<void> {
		if (!this.inputProfile) {
			return
		}

		const { first_name, last_name } = this.inputProfile

		this.updateProfileForm.patchValue({
			first_name,
			last_name
		})
	}

	onSaveHandler() {
		if (!this.inputProfile) {
			return
		}

		const first_name = this.updateProfileForm.value.first_name as string
		const last_name = this.updateProfileForm.value.last_name as string

		const profile: Profile = {
			...this.inputProfile,
			first_name,
			last_name
		}

		this.outputSave.emit(profile)
	}

	onFileUpload(event: any) {
		if (!event.target.files || event.target.files.length === 0) {
			return
		}

		const file = event.target.files[0]
		const fileExt = file.name.split(".").pop()
		const filePath = `${Math.random()}.${fileExt}`
		this.outputUpload.emit({ file: file, filepath: filePath })
	}
}
