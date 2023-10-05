import { useParams } from '@solidjs/router';
import { Component, createResource, createSignal, For, onMount } from 'solid-js';

import { EventType, fetchLocation, LocationType, fetchEvent } from "./EventTypes"


//  TODO ADJUST TIMEZONE BASED ON LOCATION
function dateString(start: Date) {
    const date_obj = new Date(start)
    const day = date_obj.toLocaleTimeString([], {
        weekday: "long", hour: "numeric", minute: "2-digit",
        timeZoneName: "short"
    }) as string
    const date = date_obj.toLocaleDateString([], { month: 'numeric', day: 'numeric' }) as string
    return `${day} (${date})`
}


const EventDisplay = (props: any) => {
    const event = props.event as EventType
    const index = props.index
    // const [location, setLocation] = createSignal<LocationType>();

    // onMount(async () => {
    //     if (event.info.location_id) {
    //         const location: LocationType = await fetchLocation(event.info.location_id)
    //         setLocation(location)
    //         // console.log(location)
    //     }
    // });


    return (
        <div class="flex flex-col bg-gray-300 rounded-lg">
            <div class="relative rounded-lg p-3">
                {event.photo_url === '' ?
                    <img style="object-fit: cover" src="https://www.usnews.com/cmsmedia/fb/31/4b2547154ca882fb4a6d6ceec15a/210927-submitted.jpg" alt="bruh" />
                    : <a href="">
                        <img class="w-full h-full object-cover" style="object-fit: contain" src={event.photo_url} />
                    </a>}
            </div>
            <div class="px-6 flex flex-col justify-between flex-grow">
                <div>
                    <h2 class="font-bold text-xl mb-2" id="name">{event.name}</h2>
                    <h3 class="text-sm mb-2" id='start'>{dateString(event.date)}</h3>
                    <h3 class="text-sm mb-2" id='location'>Location: {event.location}</h3>
                    <p class="text-sm mb-2" id='description'>{event.description}</p>
                </div>
            </div>
            <div class="px-6 pt-4 pb-2">
                <For each={["Mines"]}>{(tag, i) =>
                    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-xs font-semibold text-gray-700 mr-2 mb-2">{tag}</span>
                }</For>
            </div>

        </div>
    )
};

export default EventDisplay;
