import { Link } from "@solidjs/router"
import { Component, createResource, For, Suspense } from "solid-js"
import { createSignal, createEffect, onMount } from 'solid-js';

import NavBar from "./NavBar"
import SearchBar from "./SearchBar"
import EventCard from "./EventCard"

import type { EventInfoType, EventType } from "./EventTypes"
import { fetchEvents } from "./EventTypes"


const EventCardGrid: Component<{}> = () => {
	const [events, setEvents] = createSignal<EventType[]>([]);
	const [eventsLoaded, setEventsLoaded] = createSignal<boolean>(false);

	createEffect(async () => {
		const res = await fetchEvents(20) as EventType[]
		setEvents(res)
		setEventsLoaded(true)
	});

	return (
		eventsLoaded() ?
			<For each={events()}>{(event) =>
				<div>
					<EventCard event_id={event.info.id}></EventCard>
				</div>
			}</For>
			:
			<p>loading...</p>
	)
}


const SearchPage: Component<{}> = () => {
	const [events, setEvents] = createSignal<EventType[]>([]);

	return <>
		<NavBar></NavBar>
		<div class="flex flex-row">
			{/* <div class="flex-none" id="dashboard-left">
				Dashboard
			</div> */}
			<div class="flex-1" id="content">
				<div class="flex flex-col">
					<div class="grid gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-5">
						<EventCardGrid></EventCardGrid>
					</div>
				</div>
			</div>
		</div>
	</>
}

export default SearchPage