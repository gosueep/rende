import { Link, useSearchParams } from "@solidjs/router"
import { Component, createResource, For, Show, Suspense } from "solid-js"
import { createSignal, createEffect, onMount } from 'solid-js';

import NavBar from "./NavBar"
import SearchBar from "./SearchBar"
import EventCard from "./EventCard"

import type { EventInfoType, EventType } from "./EventTypes"
import { fetchEvents, EventListType } from "./EventTypes"


export type SearchProps = {
	query: string,
	start: number,
	location_id: number,
	showPast: boolean,
	is_recurring: boolean,
}

function search(items : Array<EventType>, props : SearchProps) {
	return items.filter((item) => {
		if (item.info.description_text.includes(props.query) ||
			item.info.name.includes(props.query)) {

		}
	})
}

function searchFilterItem(item: EventType, query: string, showPast: boolean) {
	const inSearch = (
		item.info.description_text.toLowerCase().includes(query) ||
		item.info.name.toLowerCase().includes(query))
	const showEvent = inSearch && thisMonth(item.info.start, showPast)
	return showEvent
}


function thisMonth(start : number, showPast: boolean) {

	if (showPast) {
		return true
	}

	const date_start = new Date(start)
	const now = new Date()

	return (
		now.getMonth() === date_start.getMonth() &&
		now.getFullYear() === date_start.getFullYear()
	)
}


const SearchPage: Component<{}> = () => {

	const [fetchedEvents] = createResource<EventListType, number>(20, fetchEvents)
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
	}

	const [showPast, setShowPast] = createSignal(true);


	function enablePastEvents() {
		setShowPast(!showPast())
	}

	return <>
		<NavBar onSearchChange={handleSearch} onShowPastEventsClick={enablePastEvents}></NavBar>
		{/* <SearchBar onSearchChange={handleSearch} onShowPastEventsClick={enablePastEvents}></SearchBar> */}
		<div class="flex flex-row">
			{/* <div class="flex-none" id="dashboard-left">
				Dashboard
			</div> */}
			<div class="flex-1" id="content">
				<div class="flex flex-col">
					<div class="grid gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-5">
						<Suspense fallback={<div>Loading</div>}>
							<For each={fetchedEvents()?.events}>{(event) =>
								<Show
									when={searchFilterItem(event, searchQuery(), showPast())}
								>
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