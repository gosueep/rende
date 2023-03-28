import { Link } from "@solidjs/router"
import { Component, createResource, For, Suspense } from "solid-js"
import { createSignal, createEffect, onMount } from 'solid-js';

import NavBar from "./NavBar"
import SearchBar from "./SearchBar"
import EventCard from "./EventCard"

import {fetchEvents, fetchEventsReturn} from "./EventTypes"

const SearchPage: Component<{}> = () => {
	const [fetchedEvents] = createResource<fetchEventsReturn, number>(20, fetchEvents)
	
	return <>
		<NavBar></NavBar>
		<div class="flex flex-row">
			{/* <div class="flex-none" id="dashboard-left">
				Dashboard
			</div> */}
			<div class="flex-1" id="content">
				<div class="flex flex-col">
					<div class="grid gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-5">
						<Suspense fallback={<div>Loading</div>}>
							<For each={fetchedEvents()?.events}>{(event) =>
								<div>
									<EventCard event={event}></EventCard>
								</div>
							}</For>
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	</>
} 

export default SearchPage