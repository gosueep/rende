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
					<SearchBar></SearchBar>
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
	</>
} 

export default SearchPage