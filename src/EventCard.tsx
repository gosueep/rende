import { useParams } from '@solidjs/router';
import { Component, createResource, createSignal, For, onMount } from 'solid-js';

import { EventInfoType, EventType, fetchLocation, LocationType, fetchEvent } from "./EventTypes"


function dateString(start : number) {
    const date_obj = new Date(start)
    
    const day = date_obj.toLocaleTimeString([], { weekday: "long", hour: "numeric", minute: "2-digit" }) as string
    const date = date_obj.toLocaleDateString([], { month: 'numeric', day: 'numeric'}) as string

    return `${day} (${date})`

}


const EventCard = (props: any) => {
    const event = props.event as EventType
    const [location, setLocation] = createSignal<LocationType>();

    onMount(async () => {
        if (event.info.location_id) {
            const location: LocationType = await fetchLocation(event.info.location_id)
            setLocation(location)
            // console.log(location)
        }
    });

    return (
        <div class="w-80 h-80 bg-white rounded overflow-hidden shadow-lg">
            <div class="h-full flex flex-col overflow-y-auto scrollbar-hide">
                <div class="h-40 relative bg-gray-200" style="min-height: 40%;">
                    <div class="absolute inset-0 flex items-center justify-center">
                        {event.images.length == 0 ? 
                        
                        // <p class="text-center">No Image</p>
                        <img src="https://www.usnews.com/cmsmedia/fb/31/4b2547154ca882fb4a6d6ceec15a/210927-submitted.jpg" alt="bruh" /> 

                        : <a href="">
                            <img class="w-full h-full object-cover" src={"/get_event_image/" + event.images[0]} />
                        </a>}
                    </div>
                </div>
                <div class="px-6 py-4 flex flex-col justify-between flex-grow">
                    <div>
                        <h2 class="font-bold text-xl mb-2">Name: {event.info.name}</h2>
                        <h3 class="text-sm mb-2">Location: {location()?.description}</h3>
                        <h3 class="text-sm mb-2">Start: {dateString(event.info.start)}</h3>
                    </div>
                    <div class="text-sm mb-2">Description: {event.info.description_text}</div>
                </div>
                <div class="px-6 pt-4 pb-2">
                    <For each={event.categories}>{(tag, i) =>
                        <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">{tag}</span>
                    }</For>
                </div>
            </div>
        </div >
    )
};

export default EventCard;
