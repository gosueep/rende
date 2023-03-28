

export const fetchEvents = async (num_events:any) => (await fetch (`/get_newest_events/${num_events}`)).json();
export const fetchEvent = async (id:any) => (await fetch (`/get_event/${id}`)).json();

export type EventInfoType = {
	id: string,
	name: string,
	// datetime: Date,
	// location: string,
	description_text: string,
    description_html: string,
    start: number,
	// attendees: string[],
	// is_recurring: boolean,
	// tags: string[],
}

export type EventType = {
	info: EventInfoType,
	images: string,
	categories: string[],
	rsvps: string[],
}

export type fetchEventsReturn = {
	events: EventType[]
}