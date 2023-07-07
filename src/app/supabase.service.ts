import { Injectable } from "@angular/core"

import {
	AuthChangeEvent,
	AuthSession,
	createClient,
	Session,
	SupabaseClient,
	User
} from "@supabase/supabase-js"

import { environment } from "../../environment"

interface EventResponse {
	id: any
	date_created: any
	date_modified: any
	title: any
	description: any
	tag: any
	status: any
	date_start: any
	date_end: any
}

interface EventRequest {
	user_id: string

	id?: string
	date_created: string
	date_modified: string | null

	title: string
	description: string | null
	tag: string | null
	status: boolean
	date_start: string | null
	date_end: string | null
}

export interface EventValidated {
	id?: string
	date_created: Date
	date_modified?: Date

	title: string
	description?: string
	tag?: string
	status: boolean
	date_start?: Date
	date_end?: Date
}

export interface Profile {
	id?: string
	date_modified?: string
	first_name: string
	last_name: string
	avatar_url: string
}

@Injectable({
	providedIn: "root"
})
export class SupabaseService {
	private supabase: SupabaseClient

	_session: AuthSession | null = null

	constructor() {
		this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
	}

	get session() {
		this.supabase.auth.getSession().then(({ data }) => {
			this._session = data.session
		})
		return this._session
	}

	// AUTHENTICATION

	authChanges(
		callback: (event: AuthChangeEvent, session: Session | null) => void
	) {
		return this.supabase.auth.onAuthStateChange(callback)
	}

	signIn(email: string) {
		return this.supabase.auth.signInWithOtp({ email })
	}

	signOut() {
		return this.supabase.auth.signOut()
	}

	// PROFILE

	readProfile(user: User) {
		return this.supabase
			.from("profile")
			.select(`first_name, last_name, avatar_url`)
			.eq("id", user.id)
			.single()
	}

	updateProfile(profile: Profile) {
		return this.supabase.from("profile").upsert(profile).select()
	}

	// AVATAR IMAGE ASSET

	downLoadImage(path: string) {
		return this.supabase.storage.from("avatars").download(path)
	}

	uploadAvatar(filePath: string, file: File) {
		return this.supabase.storage.from("avatars").upload(filePath, file)
	}

	// EVENT

	readEvents() {
		return this.supabase
			.from("event")
			.select(
				`date_created, date_modified, id, title, description, tag, date_start, date_end, status`
			)
	}

	createEvent(event: EventRequest) {
		return this.supabase.from("event").insert(event)
	}

	updateEvent(event: EventRequest) {
		return this.supabase.from("event").upsert(event)
	}

	deleteEvent(id: string) {
		return this.supabase.from("event").delete().eq("id", id)
	}

	// UTILITIES

	validateEventResponse(event: EventResponse) {
		const data: EventValidated = {
			id: event.id,
			date_created: new Date(event.date_created),
			date_modified: event.date_modified
				? new Date(event.date_modified)
				: undefined,

			title: event.title,
			description: event.description ? event.description : undefined,
			tag: event.tag ? event.tag : undefined,
			status: event.status,
			date_start: event.date_start ? new Date(event.date_start) : undefined,
			date_end: event.date_end ? new Date(event.date_end) : undefined
		}

		return data
	}

	convertToEventRequest(event: EventValidated, user: User) {
		const data: EventRequest = {
			user_id: user.id,
			date_created: event.date_created.toDateString(),
			date_modified: event.date_modified
				? event.date_modified.toDateString()
				: null,

			title: event.title,
			description: event.description ? event.description : null,
			tag: event.tag ? event.tag : null,
			status: event.status,
			date_start: event.date_start ? event.date_start.toDateString() : null,
			date_end: event.date_end ? event.date_end.toDateString() : null
		}

		if (event.id) {
			return {
				...data,
				id: event.id
			}
		}

		return data
	}
}
