import { Link } from "@solidjs/router"
import { Component } from "solid-js"
import { createSignal, createEffect } from 'solid-js';

import NavBar from "./NavBar"
import SearchBar from "./SearchBar"
import EventCard from "./EventCard"

interface Event {
	name: string
}

const SearchPage: Component<{}> = () => {
	const [events, setEvents] = createSignal<Event[]>([]);

	createEffect(() => {
		(async function() {
			let events_req = await fetch("http://127.0.0.1:3030/get_events");
			let events_json = await events_req.json();
			setEvents(events_json);
		})()
	  }, [setEvents]);

	  return <>
		<NavBar></NavBar>
		<div class="flex flex-row">
			{/* <div class="flex-none" id="dashboard-left">
				Dashboard
			</div> */}
			<div class="flex-1" id="content">
				<div class="flex flex-col">
					<div class="grid gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-5">
						<EventCard></EventCard>
						<EventCard></EventCard>
						<EventCard></EventCard>
						<EventCard></EventCard>
						<EventCard></EventCard>
						<EventCard></EventCard>
						<EventCard></EventCard>
						<EventCard></EventCard>
						<div class="flex-1" id="grid-events">
							<div class="grid grid-flow-row-dense grid-cols-5">
								{events().map((event) => {
									return <div>{event.name}</div>
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</>
} 

export default SearchPage