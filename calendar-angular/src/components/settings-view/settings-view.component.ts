import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core"
import { FormBuilder } from "@angular/forms"
import { Profile } from "../../app/supabase.service"
import { SafeResourceUrl } from "@angular/platform-browser"
import { User } from "@supabase/supabase-js"

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
	@Input() inputUser!: User
	@Input() inputProfile: Profile | undefined
	@Input() inputAvatarURL: SafeResourceUrl | undefined
	@Input() isLoading!: boolean

	@Output() outputSave: EventEmitter<Profile> = new EventEmitter<Profile>()
	@Output() outputUpload: EventEmitter<Upload> = new EventEmitter<Upload>()

	updateProfileForm = new FormBuilder().group({
		email: { value: "null", disabled: true },
		first_name: "",
		last_name: ""
	})

	async ngOnInit(): Promise<void> {
		if (!this.inputProfile) {
			return
		}

		const { first_name, last_name } = this.inputProfile

		const { email } = this.inputUser

		this.updateProfileForm.patchValue({
			email,
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
