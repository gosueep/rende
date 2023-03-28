export const fetchEvents = async (num_events:any) => (await fetch (`/get_newest_events/${num_events}`)).json();
export const fetchEvent = async (id:any) => (await fetch (`/get_event/${id}`)).json();
export const fetchLocation = async (id:any) => (await fetch (`/get_location/${id}`)).json();

export type EventInfoType = {
	id: string,
	club_id: number,
	location_id: number,
	name: string,
	description_text: string,
    description_html: string,
    start: number,
	is_recurring: boolean,
}

export type LocationType = {
	id: number,
	description: string,
}

export type EventType = {
	info: EventInfoType,
	images: string,
	categories: string[],
	rsvps: string[],
}

export type EventListType = {
	events: EventType[],
}