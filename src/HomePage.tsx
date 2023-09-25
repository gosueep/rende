import { Link, useSearchParams } from "@solidjs/router"
import { Component, createResource, For, Show, Suspense, useContext } from "solid-js"
import { createSignal, createEffect, onMount } from 'solid-js';

import NavBar from "./NavBar"
import SearchBar from "./SearchBar"
import EventCard from "./event/EventCard"

import { UserContext } from ".";

import type { EventType } from "./event/EventTypes"
import { fetchEvents, EventListType } from "./event/EventTypes"


export type SearchProps = {
	query: string,
	start: number,
	location_id: number,
	showPast: boolean,
	is_recurring: boolean,
}

function searchFilterItem(item: EventType, query: string, showPast: boolean) {
	const inSearch = (
		item.description.toLowerCase().includes(query) ||
		item.name.toLowerCase().includes(query))
	const showEvent = inSearch && thisMonth(item.date, showPast)
	return showEvent
}


function thisMonth(start : Date, showPast: boolean) {

	if (showPast) {
		return true
	}

	// const date_start = new Date(start)
	const now = new Date()

	return (
		now.getMonth() === start.getMonth() &&
		now.getFullYear() === start.getFullYear()
	)
}

const SearchPage: Component<{}> = () => {
	const [fetchedEvents] = createResource<EventType[], number>(1000, fetchEvents)
	const [filteredEvents, setFilteredEvents] = createSignal(fetchedEvents)
	const [searchQuery, setSearchQuery] = createSignal('')
	const [searchProps, setSearchProps] = createSignal<SearchProps>({
		query: '',
		start: 0,
		location_id: -1,
		showPast: true,
		is_recurring: true
	})

	function handleSearch(e: any) {
		const query = e.target.value as string
		setSearchQuery(query.toLowerCase())
		console.log(fetchedEvents()?.toString)
	}

	const [showPast, setShowPast] = createSignal(true);


	function enablePastEvents() {
		setShowPast(!showPast())
	}

	const token = useContext(UserContext);
	return <>
		<NavBar onSearchChange={handleSearch} onShowPastEventsClick={enablePastEvents}></NavBar>
		{/* <div class="hidden sm:ml-6 sm:block items-center w-2/5 justify-center">
			{<SearchBar onSearchChange={handleSearch} onShowPastEventsClick={enablePastEvents}></SearchBar>}
		</div> */}
		<div class="flex flex-row">
			<div class="flex-1" id="content">
				<div class="flex flex-col">
					<div class="grid gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-5">
						<Suspense fallback={<div>Loading</div>}>
							<For each={fetchedEvents()}>{(event) =>
								<Show when={searchFilterItem(event, searchQuery(), showPast())}>
									<EventCard event={event}/>
								</Show>
							}</For>
						</Suspense>
					</div>
				</div>
			</div>
		</div>
	</>
}

export default SearchPage