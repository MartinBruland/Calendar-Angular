import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core"
import { SupabaseService, EventValidated, Profile } from "./supabase.service"
import { SafeResourceUrl, DomSanitizer } from "@angular/platform-browser"

import { Upload } from "src/components/settings-view/settings-view.component"

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
	labelTitle = "Calendar"
	labelSignOut = "Sign Out"
	labelAccount = "Account"
	labelHome = "Calendar"

	session = this.supabase.session

	profile: Profile | undefined

	avatarURL: SafeResourceUrl | undefined

	events: EventValidated[] = []

	selectedDate: Date | undefined = undefined

	selectedTag: string = "All"

	selectedEvent: EventValidated | undefined = undefined

	defaultTags = ["All", "Completed"]

	availableTags = this.defaultTags

	isSettingsViewVisible = false

	isUpdateViewVisible = false

	message = ""

	constructor(
		private readonly supabase: SupabaseService,
		private readonly dom: DomSanitizer
	) {}

	async ngOnInit(): Promise<void> {
		this.supabase.authChanges((_, session) => {
			this.session = session
		})

		this.events = (await this.readEvents()) ?? []

		this.profile = (await this.getProfile()) ?? undefined

		this.avatarURL = this.profile
			? await this.downloadImage(this.profile.avatar_url)
			: undefined
	}

	ngOnChanges(changes: SimpleChanges): void {
		const updatedEvents: EventValidated[] = changes["events"].currentValue

		const updatedTags = updatedEvents
			.map(event => event.tag)
			.filter(tag => tag !== undefined) as string[]

		const allTags = [...new Set([...this.defaultTags, ...updatedTags])]

		if (this.selectedTag && !allTags.includes(this.selectedTag))
			this.setSelectedTag(this.defaultTags[0])

		this.availableTags = allTags
	}

	setSelectedDate(date: Date) {
		this.selectedDate = date
	}

	setSelectedTag(tag: string) {
		this.selectedTag = tag
	}

	setSelectedEvent(event: EventValidated) {
		this.selectedEvent = event
	}

	setUpdateViewState(state: boolean) {
		this.isUpdateViewVisible = state
	}

	setSettingsViewState() {
		this.isSettingsViewVisible = !this.isSettingsViewVisible
	}

	async setCreatedEvent(event: EventValidated) {
		await this.createEvent(event).then(async () => {
			const data = await this.readEvents()
			if (data) {
				this.events = data
			}
		})
	}

	async setUpdatedEvent(event: EventValidated) {
		this.isUpdateViewVisible = false
		await this.updateEvent(event).then(async () => {
			const data = await this.readEvents()
			if (data) {
				this.events = data
			}
		})
	}

	async setDeletedEvent(event: EventValidated) {
		if (!event.id) {
			return
		}
		this.isUpdateViewVisible = false
		await this.deleteEvent(event.id).then(async () => {
			const data = await this.readEvents()
			if (data) {
				this.events = data
			}
		})
	}

	async setLoginDetails(email: string) {
		await this.signIn(email)
	}

	async setUpdatedProfile(profile: Profile) {
		await this.updateProfile(profile)
		this.profile = profile
	}

	async setUploadedFile(upload: Upload) {
		await this.uploadAvatar(upload.filepath, upload.file).then(async () => {
			// Update profile
			if (!this.profile) return
			const updatedProfile: Profile = {
				...this.profile,
				avatar_url: upload.filepath
			}

			await this.updateProfile(updatedProfile)

			// Update avatar url
			this.avatarURL = await this.downloadImage(upload.filepath)
		})
	}

	// SUPABASE CONTROLLERS

	async getProfile() {
		if (!this.session) {
			return
		}

		const { user } = this.session

		try {
			const { data, error } = await this.supabase.readProfile(user)

			if (data) {
				return data
			}

			if (error) {
				throw new Error(error.message)
			}

			return null
		} catch (error) {
			console.error("Error retrieving profile:", error)

			throw new Error("An error occurred while retrieving the profile.")
		}
	}

	async updateProfile(profile: Profile) {
		try {
			if (!this.session) {
				return
			}

			const { user } = this.session

			const updateProfile: Profile = {
				...profile,
				id: user.id,
				date_modified: new Date().toDateString()
			}

			const { data, error } = await this.supabase.updateProfile(updateProfile)

			if (data) {
				return data
			}

			if (error) {
				throw new Error(error.message)
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error updating profile:", error.message)
				throw new Error("An error occurred while updating the profile.")
			}
		}
		return
	}

	async downloadImage(path: string) {
		try {
			const { data, error } = await this.supabase.downLoadImage(path)

			if (data instanceof Blob) {
				return this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data))
			}

			if (error) {
				throw new Error(error.message)
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error downloading avatar:", error.message)
				throw new Error("An error occurred while downloading the avatar.")
			}
		}
		return
	}

	async uploadAvatar(filePath: string, file: File) {
		try {
			await this.supabase.uploadAvatar(filePath, file)
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error uploading avatar:", error.message)
				throw new Error("An error occurred while uploading the avatar.")
			}
		}
	}

	async signIn(email: string) {
		try {
			const { data, error } = await this.supabase.signIn(email)

			if (data) {
				this.message = "Check your email for the login link!"
			}

			if (error) {
				throw new Error(error.message)
			}
		} catch (error) {
			if (error instanceof Error) {
				this.message = error.message
				console.error("Error signing in:", error.message)
			}
		}
	}

	async signOut() {
		await this.supabase.signOut()
	}

	async createEvent(event: EventValidated) {
		try {
			if (!this.session) {
				return
			}

			const { user } = this.session

			const convertedEvent = this.supabase.convertToEventRequest(event, user)

			if (!convertedEvent)
				throw new Error("An error occurred during event convert")

			const { error } = await this.supabase.createEvent(convertedEvent)

			if (error) {
				throw new Error(error.message)
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error creating event:", error)
				throw new Error("An error occurred while creating the event.")
			}
		}

		return
	}

	async readEvents() {
		try {
			const { data, error } = await this.supabase.readEvents()

			if (data) {
				return data.map(item => {
					return this.supabase.validateEventResponse(item)
				})
			}

			if (error) {
				throw new Error(error.message)
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error retrieving events:", error)
				throw new Error("An error occurred while retrieving the events.")
			}
		}

		return null
	}

	async updateEvent(event: EventValidated) {
		try {
			if (!this.session) {
				return
			}

			const { user } = this.session

			const updatedEvent: EventValidated = {
				...event,
				date_modified: new Date()
			}

			const convertedEvent = this.supabase.convertToEventRequest(
				updatedEvent,
				user
			)

			if (!convertedEvent)
				throw new Error("An error occurred during event convert")

			const { error } = await this.supabase.updateEvent(convertedEvent)

			if (error) {
				throw new Error(error.message)
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error updating event:", error)
				throw new Error("An error occurred while updating the event.")
			}
		}

		return
	}

	async deleteEvent(id: string) {
		try {
			const { error } = await this.supabase.deleteEvent(id)

			if (error) {
				throw new Error(error.message)
			}
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error deleting event:", error)
				throw new Error("An error occurred while deleting the event.")
			}
		}

		return
	}
}
