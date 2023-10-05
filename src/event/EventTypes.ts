export const fetchEvents = async function (num_events:any) {
	const resp = await fetch (`/api/get_latest_events/${num_events}`)
	const results = await resp.json()
	const output = results as EventType[]
	return output
}
export const fetchEvent = async (id:any) => (await fetch (`/api/get_event/${id}`)).json();
export const fetchLocation = async (id:any) => (await fetch (`/api/get_location/${id}`)).json();

export function dateString(start : Date) {
    const date_obj = new Date(start)   
    const day = date_obj.toLocaleTimeString([], { 
        weekday: "long", hour: "numeric", minute: "2-digit", 
        timeZoneName: "short"
    }) as string
    const date = date_obj.toLocaleDateString([], { month: 'numeric', day: 'numeric'}) as string
    return `${day} (${date})`
}

export function timeString(start : Date) {
    const date_obj = new Date(start)   
    const day = date_obj.toLocaleTimeString([], { 
        hour: "numeric", minute: "2-digit",
    }) as string
    return day
}

export function getDay(start : Date) {
	return new Date(start).toLocaleDateString([], {weekday: "long"}) as string
}

export type EventType = {
	id: string,
	org_id: string,
	location: string,
	name: string,
	description: string,
	date: Date,
	photo_url: string,
    // description_html: string,
    // start: number,
	is_recurring: boolean,
}

export type LocationType = {
	id: number,
	description: string,
}

// export type EventType = {
// 	info: EventInfoType,
// 	images: string,
// 	categories: string[],
// 	rsvps: string[],
// }

export type EventListType = {
	events: EventType[]
}