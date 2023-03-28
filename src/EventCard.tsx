import { useParams } from '@solidjs/router';
import { Component, createResource, createSignal, For, onMount } from 'solid-js';

import { EventInfoType, EventType, fetchLocation, LocationType, fetchEvent } from "./EventTypes"

const EventCard = (props: any) => {
    const event = props.event as EventType
    const [location, setLocation] = createSignal<LocationType>();

    onMount(async () => {
        if (event.info.location_id) {
            const location: LocationType = await fetchLocation(event.info.location_id)
            setLocation(location)
        }
    });

    return (
        <div class="max-h-sm min-h-sm rounded overflow-hidden shadow-lg">
            {event.images.length == 0 ? <p>no image</p> : <a href="">
                <img class="object-fill" src={"/get_event_image/" + event.images[0]} />
            </a>}
            <div class="px-6 py-4">
                <h2>Name: {event.info.name}</h2>
                <h3>Location: {location()?.description}</h3>
                <h3>Start: {new Date((event.info.start ?? 0) * 1000).toLocaleTimeString([], { weekday: "long", hour: "numeric", minute: "2-digit" })}</h3>
                <h3>Description: {event.info.description_text}</h3>
            </div>
            <div class="px-6 pt-4 pb-2">
                <For each={event.categories}>{(tag, i) =>
                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">{tag}</span>
                }</For>
            </div>
        </div >
    )
};

export default EventCard;