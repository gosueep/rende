import { useParams } from '@solidjs/router';
import { Component, createSignal, For, onMount } from 'solid-js';
import { EventInfoType, EventType, fetchLocation, LocationType, EventListType, fetchEvent } from "./EventTypes"

const EventInfo = (props: { event_id: number }) => {
	const [event, setEvent] = createSignal<EventType>();
	const [location, setLocation] = createSignal<LocationType>();

	onMount(async () => {
		const event: EventType = await fetchEvent(props.event_id)
		if (event.info.location_id) {
			const location: LocationType = await fetchLocation(event.info.location_id)
			setLocation(location)
		}
		setEvent(event)
	});

	return (
		<div class="flex">
			<div class="flex basis-4/5">
				<div class="flex-auto basis-2/5">
					<h1>Event Name: {event()?.info.name}</h1>
				</div>
				<div class="flex-initial basis-3/5">
					<h1>Picture & info</h1>
					<div>Pic</div>
					event()?.images.length == 0 ? <p>no image</p> : <a href="">
						<img class="object-fill" src={"http://localhost:3030/get_event_image/" + event()?.images[0]} />
					</a>
					<div>
						<div>
							Location: {location()?.description}
						</div>
						<div>
							Time: {new Date((event()?.info.start ?? 0) * 1000).toLocaleTimeString([], { weekday: "long", hour: "numeric", minute: "2-digit" })}
						</div>
						<div>
							Description: {event()?.info.description_text}
						</div>
					</div>
				</div>
			</div>

			<div class="flex-none basis-1/5">
				<h1>Rsvps</h1>
				<For each={event()?.rsvps}>
					{(rsvp) =>
						<li>{rsvp}</li>
					}
				</For>
			</div>
		</div>
	)
}

const EventPage: Component<{}> = () => {
	const params = useParams();
	return <>
		<div class="container mx-auto py-8 px-32 bg-sky-100">
			<EventInfo event_id={parseInt(params.event_id)} />
		</div>
	</>
};

export default EventPage;