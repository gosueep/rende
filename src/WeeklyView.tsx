import { Link, useSearchParams } from "@solidjs/router"
import { Component, createResource, For, Show, Suspense, useContext } from "solid-js"
import { createSignal, createEffect, onMount } from 'solid-js';
import { createTable, createTableInstance } from '@tanstack/solid-table'

import NavBar from "./NavBar"
import SearchBar from "./SearchBar"
import EventCard from "./event/EventCard"

import { UserContext } from ".";

import type { EventType } from "./event/EventTypes"
import { fetchEvents, getDay, dateString } from "./event/EventTypes"
import EventDisplay from "./event/EventDisplay";
import WeeklyEventCard from "./event/WeeklyCard";


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
    const showEvent = inSearch
    // && thisMonth(item.date)
    return showEvent
}


function thisMonth(start: Date) {
    const now = new Date()
    return (
        now.getMonth() === start.getMonth() &&
        now.getFullYear() === start.getFullYear()
    )
}

// function thisWeek(start : Date) {
// 	const now = new Date()
// 	return (
// 		now.getFullYear() === start.getFullYear()
//         &&
//         (
//             ((now.getMonth() === start.getMonth()) && (Math.abs(now.getDay() - start.getDay()) <= 7))
//             ||
//             ((now.getMonth() === start.getMonth()+1) && (Math.abs(now.getDay() - start.getDay()) <= 7))
//             ||
//             ((now.getMonth() === start.getMonth()) && (Math.abs(now.getDay() - start.getDay()) <= 7))
//         )
// 	)
// }

const HomePage: Component<{}> = () => {
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

    const [curr, setCurr] = createSignal(0);
    function currEvent() {
        return fetchedEvents()?.at(curr())
    }


    const [showPast, setShowPast] = createSignal(true);
    function enablePastEvents() {
        setShowPast(!showPast())
    }

    const table = createTable()

    return <>
        <NavBar onSearchChange={handleSearch} onShowPastEventsClick={enablePastEvents}></NavBar>
        <div class="m-10 h-4/5">
            <div class="flex" style="height: 80vh;">
                <Suspense fallback={<div>Loading</div>}>
                    <div class="basis-4/5">
                        {/* <div class="display: inline-block">
                            
                        <For each={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}>{(day) =>
                            <ul class="list-none" style="display: inline-block;">
                                <li>{day}</li>
                                <For each={fetchedEvents()}>{(event, i) =>
                                    <Show when={getDay(event.date) === day && searchFilterItem(event, searchQuery(), showPast())}>
                                        <li class="border">
                                            <WeeklyEventCard event={event} onClick={() => setCurr(i())} />
                                        </li>
                                    </Show>
                                }</For>
                            </ul>
                        }</For>
                        </div> */}
                        <table class="table-fixed border w-full">
                            <thead>
                                <tr>
                                    <For each={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}>{(day) =>
                                        <th>{day}</th>
                                    }</For>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <For each={["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]}>{(day) =>
                                        <td class="border">
                                            <table style="table-fixed w-full">
                                                <tbody>
                                                    <tr>
                                                        <td class="w-32">
                                                            <ul class="list-none w-full" style="display: inline-block;">
                                                                <For each={fetchedEvents()}>{(event, i) =>
                                                                    <Show when={getDay(event.date) === day && searchFilterItem(event, searchQuery(), showPast())}>
                                                                        <li class="border">
                                                                            <WeeklyEventCard event={event} onClick={() => setCurr(i())} />
                                                                        </li>
                                                                    </Show>
                                                                }</For>
                                                            </ul>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    }</For>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="basis-2/5 bg-gray-300 rounded-lg">
                        <div class="flex flex-col bg-gray-300 rounded-lg">
                            <div class="relative rounded-lg p-3">
                                {fetchedEvents()?.at(curr())?.photo_url === '' ?
                                    <img style="object-fit: cover" src="https://upload.wikimedia.org/wikipedia/commons/6/62/Downtown_Houston%2C_TX_Skyline_-_2018.jpg" alt="htx skyline" />
                                    : <a href="">
                                        <img class="w-full h-full object-cover" style="object-fit: contain" src={currEvent()?.photo_url} />
                                    </a>}
                            </div>
                            <div class="px-6 flex flex-col justify-between flex-grow">
                                <div>
                                    <h2 class="font-bold text-xl mb-2" id="name">{currEvent()?.name}</h2>
                                    <h3 class="text-sm mb-2" id='start'>{dateString(currEvent()?.date!)}</h3>
                                    <h3 class="text-sm mb-2" id='location'>Location: {currEvent()?.location}</h3>
                                    <p class="text-sm mb-2" id='description'>{currEvent()?.description}</p>
                                </div>
                            </div>
                            <div class="px-6 pt-4 pb-2">
                                <For each={["Mines"]}>{(tag, i) =>
                                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">{tag}</span>
                                }</For>
                            </div>
                        </div>
                    </div>
                </Suspense>
            </div>
        </div>
    </>
}

export default HomePage