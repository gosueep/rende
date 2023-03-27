import { useParams } from '@solidjs/router';
import { Component, createSignal, For, onMount } from 'solid-js';

export type EventInfoType = {
	id: string,
	name: string,
	datetime: Date,
	location: string,
	description: string,
	attendees: string[],
	is_recurring: boolean,
	tags: string[],
}

type eventProps = {
	eventinfo: EventInfoType
}


const EventInfo = (props: any) => {
// new Promise(resolve =>  

	const [eventinfo, setEventInfo] = createSignal<EventInfoType>({
		id: 'test-UFJKDJFSDF',
		name: 'Test Event',
		datetime: new Date(Date.now()),
		location: 'Marquez 123',
		description: 'We meeting to plan stuff uhhh :)',
		attendees: ['Eugin', 'NotEugin'],
		is_recurring: false,
		tags: []
	})

	onMount(() => {
		fetch('http://localhost:3030/get_events')
			.then(response => response.json())
			.then(events => {
				console.log(events)
				setEventInfo(eventinfo)
			})
	})

	return (
		<div class="flex">
			<div class="flex basis-4/5">
				<div class="flex-auto basis-2/5">
					<h1>Event Name: {eventinfo().name}</h1>
					ID: {eventinfo().id}
				</div>
				<div class="flex-initial basis-3/5">
					<h1>Picture & info</h1>
					<div>Pic</div>
					<img src='https://fastly.picsum.photos/id/885/536/354.jpg?hmac=nb-YS7sUHLHyomxpcq5fGN5pLtS_DE1-348TrXS3wL4'></img>
					{/* <img src='https://picsum.photos/400/200'></img> */}
					<div>
						<div>
							Location: {eventinfo().location}
						</div>
						<div>
							Time: {eventinfo().datetime.toLocaleTimeString([], { weekday: "long", hour: "numeric", minute: "2-digit" })}
						</div>
						<div>
							Info: {eventinfo().description}
						</div>
					</div>
				</div>
			</div>

			<div class="flex-none basis-1/5">
				<h1>Attendees</h1>
				<For each={eventinfo().attendees}>
					{(attendee) =>
					<li>{attendee}</li>
				}
				</For>
			</div>
		</div>
	)
}

const EventPage: Component<{}> = () => {
	const params = useParams();
	const event_id = params.event_id;
	const [eventInfo, setEventInfo] = createSignal<EventInfoType>();
	onMount(() => {
		fetch('http://localhost:3030/get_clubs')
			.then(response => response.json())
			.then(events => {
				console.log(events)
				setEventInfo(eventInfo)
			})
	})
	return <>
		<div class="container mx-auto py-8 px-32 bg-sky-100">
			<EventInfo event_id={event_id}/>
		</div>
	</>
};

export default EventPage;

// export default function EventPage() {
// 	const params = useParams();
// 	return <>
// 		<div class="container mx-auto py-8 px-32">
// 			<div class="flex">
// 				<div class="flex-auto basis-2/5">
// 					Event Name params.id
// 				</div>
// 				<div class="flex-initial basis-3/5">
// 					Picture & info
// 				</div>
// 				<div class="flex-none basis-1/10">
// 					Attendees
// 				</div>
// 			</div>
// 		</div>
// 	</>
// };
