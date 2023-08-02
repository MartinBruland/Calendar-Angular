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

	availableTags: string[] = []

	selectedEvent: EventValidated | undefined = undefined

	selectedDate: Date | undefined = undefined

	selectedTag: string = "All"

	isSettingsViewVisible = false

	isUpdateViewVisible = false

	message: string | undefined

	isLoading: boolean = false

	constructor(
		private readonly supabase: SupabaseService,
		private readonly dom: DomSanitizer
	) {}

	async ngOnInit(): Promise<void> {
		this.supabase.authChanges((_, session) => {
			this.session = session
		})

		await this.readEvents().then(data => {
			if (data) {
				this.events = data
				this.availableTags = this.reloadFilters(data)
			}
		})

		this.profile = await this.getProfile()

		this.avatarURL = this.profile?.avatar_url
			? await this.downloadImage(this.profile.avatar_url)
			: undefined
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

	closeNotificationhandler(state: boolean) {
		if (!state) {
			this.message = undefined
		}
	}

	reloadFilters(events: EventValidated[]) {
		const updatedTags = events
			.map(event => event.tag)
			.filter(tag => tag !== undefined) as string[]

		const defaultTags = ["All", "Completed"]

		const allTags = [...new Set([...defaultTags, ...updatedTags])]

		if (this.selectedTag && !allTags.includes(this.selectedTag))
			this.setSelectedTag(defaultTags[0])

		return allTags
	}

	// SUPABASE CONTROLLERS

	async updateUserEmail(email: string) {
		const { data, error } = await this.supabase.updateEmail(email)

		if (error) {
			this.message = "An error occurred while updating the email"
			console.error("Error updating email:", error.message)
			throw new Error("An error occurred while updating the email.")
		}

		if (data) {
			return data
		}

		return
	}

	async getProfile() {
		if (!this.session) {
			return
		}

		const { user } = this.session

		const { error, data } = await this.supabase.readProfile(user)

		if (error) {
			this.message = "An error occurred while retrieving the profile"
			console.error("Error retrieving profile:", error.message)
			throw new Error("An error occurred while retrieving the profile.")
		}

		if (data) {
			return data
		}

		return
	}

	async updateProfile(profile: Profile) {
		if (!this.session) {
			return
		}

		const { user } = this.session

		const updateProfile: Profile = {
			...profile,
			id: user.id,
			date_modified: new Date().toDateString()
		}

		const { error, data } = await this.supabase.updateProfile(updateProfile)

		if (error) {
			this.message = "An error occurred while updating the profile"
			console.error("Error updating profile:", error.message)
			throw new Error("An error occurred while updating the profile.")
		}

		if (data) {
			this.message = "Update completed"
			this.profile = data as Profile
		}

		return
	}

	async downloadImage(path: string) {
		const { error, data } = await this.supabase.downLoadImage(path)

		if (error) {
			this.message = "An error occurred while downloading the avatar"
			console.error("Error downloading avatar:", error.message)
			throw new Error("An error occurred while downloading the avatar.")
		}

		if (data instanceof Blob) {
			return this.dom.bypassSecurityTrustResourceUrl(URL.createObjectURL(data))
		}

		return
	}

	async uploadAvatar(upload: Upload) {
		this.isLoading = true

		const { error, data } = await this.supabase.uploadAvatar(
			upload.filepath,
			upload.file
		)

		if (error) {
			this.isLoading = false
			this.message = "An error occurred while uploading the avatar"
			//console.error("Error uploading avatar:", error.message)
			//throw new Error("An error occurred while uploading the avatar.")
			return
		}

		if (data) {
			if (!this.profile) return
			const updatedProfile: Profile = {
				...this.profile,
				avatar_url: upload.filepath
			}

			// Update profile
			await this.updateProfile(updatedProfile)

			// Download avatar
			this.avatarURL = await this.downloadImage(upload.filepath)

			this.message = "Image uploaded"
			this.isLoading = false

			return
		}

		return
	}

	async signIn(email: string) {
		const { error, data } = await this.supabase.signIn(email)

		if (error) {
			this.message = error.message
			console.error("Error signing in:", error.message)
			throw new Error(error.message)
		}

		if (data) {
			this.message = "Check your email for the login link!"
			return
		}
	}

	async signOut() {
		await this.supabase.signOut()
	}

	async createEvent(event: EventValidated) {
		if (!this.session) {
			return
		}

		const { user } = this.session

		const convertedEvent = this.supabase.convertToEventRequest(event, user)

		if (!convertedEvent) throw new Error("An error occurred during event convert")

		const { error } = await this.supabase.createEvent(convertedEvent)

		if (error) {
			this.message = "An error occurred while creating the event"
			console.error("Error creating event:", error.message)
			throw new Error("An error occurred while creating the event.")
		}

		await this.readEvents().then(data => {
			if (data) {
				this.events = data
				this.availableTags = this.reloadFilters(data)
			}
		})
	}

	async readEvents() {
		const { error, data } = await this.supabase.readEvents()

		if (error) {
			this.message = "An error occurred while retrieving the events"
			console.error("Error retrieving events:", error.message)
			throw new Error("An error occurred while retrieving the events.")
		}

		if (data) {
			return data.map(item => {
				return this.supabase.validateEventResponse(item)
			})
		}

		return
	}

	async updateEvent(event: EventValidated) {
		if (!this.session) {
			return
		}

		this.isUpdateViewVisible = false

		const { user } = this.session

		const updatedEvent: EventValidated = {
			...event,
			date_modified: new Date()
		}

		const convertedEvent = this.supabase.convertToEventRequest(updatedEvent, user)

		const { error } = await this.supabase.updateEvent(convertedEvent)

		if (error) {
			this.message = "An error occurred while updating the event"
			console.error("Error updating event:", error.message)
			throw new Error("An error occurred while updating the event.")
		}

		await this.readEvents().then(data => {
			if (data) {
				this.events = data
				this.availableTags = this.reloadFilters(data)
			}
		})
	}

	async deleteEvent(event: EventValidated) {
		if (!event.id) {
			return
		}

		this.isUpdateViewVisible = false

		const { error } = await this.supabase.deleteEvent(event.id)

		if (error) {
			this.message = "An error occurred while deleting the event"
			console.error("Error deleting event:", error.message)
			throw new Error("An error occurred while deleting the event.")
		}

		await this.readEvents().then(data => {
			if (data) {
				this.events = data
				this.availableTags = this.reloadFilters(data)
			}
		})
	}
}
