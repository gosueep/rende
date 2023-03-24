import { useParams } from '@solidjs/router';
import { Component, createSignal, For, onMount } from 'solid-js';

import type {EventInfoType} from "./EventPage"

export default function EventCard() {

    // const [eventInfo, setEventInfo] = 
    const [eventinfo, setEventInfo] = createSignal<EventInfoType>({
		id: 'test-UFJKDJFSDF',
		name: 'Test Event',
		datetime: new Date(Date.now()),
		location: 'Marquez 123',
		description: 'We meeting to plan stuff uhhh :)',
		attendees: ['Eugin', 'NotEugin'],
		is_recurring: false,
        tags: ['CS@Mines', 'Cybersecurity']
	})

    onMount(() => {
		fetch('http://localhost:3030/get_clubs')
			.then(response => response.json())
			.then(events => {
				console.log(events)
				setEventInfo(eventinfo)
			})
	})

    return (
        <div class="max-h-sm min-h-sm rounded overflow-hidden shadow-lg">
            <a href="">
                {/* <img class="flex-1" src="https://oresec.mines.edu/img/full.jpeg" alt="Sunset in the mountains"></img> */}
                <img class="object-fill" src ="https://images.pexels.com/photos/255419/pexels-photo-255419.jpeg?cs=srgb&dl=pexels-pixabay-255419.jpg&fm=jpg"></img>
            </a>
            <div class="px-6 py-4">
                <h2>{eventinfo().name}</h2>
                <h3>{eventinfo().location}</h3>
                <h3>{eventinfo().datetime.toLocaleTimeString([], { weekday: "long", hour: "numeric", minute: "2-digit" })}</h3>
                <p class="text-gray-700 text-base">
                    {eventinfo().description}
                    {/* Dish is giving a talk blah something asdfjaklsdjflkasdjfDish is giving a talk blah something asdfjaklsdjflkasdjfDish is giving a talk blah something asdfjaklsdjflkasdjfDish is giving a talk blah something asdfjaklsdjflkasdjfDish is giving a talk blah something asdfjaklsdjflkasdjf */}
                </p>
            </div>
            <div class="px-6 pt-4 pb-2">
                <For each={eventinfo().tags}>{(tag, i) =>
                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">{tag}</span>
                }</For>
            </div>
        </div>
    )
};