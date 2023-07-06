export type EventResponse = {
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

export type EventValidated = {
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

export type EventRequest = {
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

export type Profile = {
    id?: string
    first_name: string
    last_name: string
    avatar_url: string
};