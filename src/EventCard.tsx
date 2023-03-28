import { useParams } from '@solidjs/router';
import { Component, createResource, createSignal, For, onMount } from 'solid-js';

import { EventInfoType, EventType, fetchLocation, LocationType, fetchEvent } from "./EventTypes"

const EventCard = (props: any) => {
    const event_id = props.event_id
    const [event, setEvent] = createSignal<EventType>();
    const [location, setLocation] = createSignal<LocationType>();

    onMount(async () => {
        const event: EventType = await fetchEvent(event_id)
        if (event.info.location_id) {
            const location: LocationType = await fetchLocation(event.info.location_id)
            setLocation(location)
        }
        setEvent(event)
    });

    return (
        <div class="max-h-sm min-h-sm rounded overflow-hidden shadow-lg">
            event()?.images.length == 0 ? <p>no image</p> : <a href="">
                <img class="object-fill" src={"http://localhost:3030/get_event_image/" + event()?.images[0]} />
            </a>
            <div class="px-6 py-4">
                <h2>{event()?.info.name}</h2>
                <h3>{location()?.description}</h3>
                <h3>{new Date(event()?.info.start ?? "DateString").toLocaleTimeString([], { weekday: "long", hour: "numeric", minute: "2-digit" })}</h3>
                <p class="text-gray-700 text-base">
                    {event()?.info.description_text}
                </p>
            </div>
            {/* <div class="px-6 pt-4 pb-2">
                <For each={event.categories}>{(tag, i) =>
                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">{tag}</span>
                }</For>
            </div> */}
        </div >
    )
};

export default EventCard;