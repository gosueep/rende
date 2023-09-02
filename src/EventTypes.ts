// export const fetchEvents = async (num_events:any) => ({

// 	const resp = await fetch (`http://localhost:8000/get_latest_events/${num_events}`, {
// 		// method: "POST",
// 		// mode: "no-cors",
// 	})
// }
// 	).json();

export const fetchEvents = async function (num_events:any) {
	const resp = await fetch (`http://localhost:8000/get_latest_events/${num_events}`, {
		// method: "POST",
		// mode: "no-cors",
	})
	console.log(resp)
	// console.log(resp.json)
	return resp.json()
}
export const fetchEvent = async (id:any) => (await fetch (`http://localhost:8000/get_event/${id}`)).json();
export const fetchLocation = async (id:any) => (await fetch (`localhost:8000/get_location/${id}`)).json();

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