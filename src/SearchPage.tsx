import { Link } from "@solidjs/router"
import { Component, For } from "solid-js"
import { createSignal, createEffect, onMount } from 'solid-js';

import NavBar from "./NavBar"
import SearchBar from "./SearchBar"
import EventCard from "./EventCard"

import type {EventInfoType, EventType} from "./EventTypes"
import {fetchEvents} from "./EventTypes"


const EventCardGrid: Component<{}> = () => {
	const [events, setEvents] = createSignal<EventType[]>([]);

	console.log(events())
	console.log("SDFSDFSDF")
	console.log(events() === undefined || events().length == 0)
	createEffect(async () => {
		const res = await fetchEvents(20) as EventType[]
        setEvents(res)
		// console.log(events())
		// console.log("DONE UP HERE")
	});

	// if (events() === undefined || events().length == 0) {
	// 	return <div>Loading...</div>
	// }

	return (
	<For each={events()}>{(event) =>
		<div>
			<EventCard event_id={event.info.id}></EventCard>
			<p>bruh</p>
		</div>
	}</For>
	)
}


const SearchPage: Component<{}> = () => {
	const [events, setEvents] = createSignal<EventType[]>([]);

	// onMount(() => {
	// 	fetch('http://localhost:3030/get_newest_events/20')
	// 		.then(response => response.json())
	// 		.then(events => {
	// 			console.log(events)
	// 			setEvents(events)
	// 		})
	// })

	// onMount(async () => {
    //     const res = await fetchEvents(20) as EventType[]
    //     setEvents(res)
	// 	console.log(events())
    // });

	createEffect(async () => {
		const res = await fetchEvents(20) as EventType[]
        setEvents(res)
		// console.log(events())
	});


	// if (events() === undefined || events().length == 0) {
	// 	return <div>Loading...</div>
	// }

	return <>
		<NavBar></NavBar>
		<div class="flex flex-row">
			{/* <div class="flex-none" id="dashboard-left">
				Dashboard
			</div> */}
			<div class="flex-1" id="content">
				<div class="flex flex-col">
					<div class="grid gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-5">
						<EventCard event_id={1}></EventCard>
						<EventCard event_id={2}></EventCard>
						<EventCard event_id={3}></EventCard>
						<EventCard event_id={4}></EventCard>
						<EventCardGrid></EventCardGrid>
						{/* <For each={events()}>{(event) =>
						<div>
							<EventCard event_id={event.info.id}></EventCard>
							<p>bruh</p>
						</div>
						}</For> */}
					</div>
				</div>
			</div>
		</div>
	</>
} 

export default SearchPage