import { useParams } from '@solidjs/router';
import { Component, createResource, createSignal, For, onMount } from 'solid-js';

import type {EventInfoType, EventType} from "./EventTypes"
import { fetchEvent } from './EventTypes';

const EventCard = (props: any) => {
    
    const event_id = props.event_id

    const [eventinfo, setEventInfo] = createSignal<EventInfoType>();
    const [event, setEvent] = createSignal<EventType>();

    onMount(async () => {
        const res = await fetchEvent(event_id) as EventType
        setEvent(res)
        setEventInfo(res.info)
    });

    return (
        <div class="max-h-sm min-h-sm rounded overflow-hidden shadow-lg">
            <a href="">
                {/* <img class="flex-1" src="https://oresec.mines.edu/img/full.jpeg" alt="Sunset in the mountains"></img> */}
                <img class="object-fill" src ="https://images.pexels.com/photos/255419/pexels-photo-255419.jpeg?cs=srgb&dl=pexels-pixabay-255419.jpg&fm=jpg"></img>
            </a>
            <div class="px-6 py-4">
                <h2>{eventinfo()?.name}</h2>
                {/* <h3>{eventinfo().location}</h3> */}
                <h3>{new Date(eventinfo()?.start ?? "DateString").toLocaleTimeString([], { weekday: "long", hour: "numeric", minute: "2-digit" })}</h3>
                <p class="text-gray-700 text-base">
                    {eventinfo()?.description_text}
                </p>
            </div>
            <div class="px-6 pt-4 pb-2">
                <For each={event()?.categories}>{(tag, i) =>
                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">{tag}</span>
                }</For>
            </div>
        </div>
    )
};

export default EventCard;