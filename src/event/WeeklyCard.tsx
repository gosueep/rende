import { useParams } from '@solidjs/router';
import { Component, createResource, createSignal, For, onMount } from 'solid-js';

import { EventType, fetchLocation, LocationType, fetchEvent, timeString } from "./EventTypes"


const WeeklyEventCard = (props: any) => {
    const event = props.event as EventType
    return (
        <div onClick={props.onClick}
            class="w-full h-16 bg-blue-300 rounded shadow-md hover:cursor-pointer hover:bg-blue-100">
                <div class="px-2 h-2/3 min-w-full overflow-hidden">
                    <h3 class="text-sm text-ellipsis mb-2 w-full inline-block" id="name">{event.name}</h3>
                </div>
                <div class="px-2 pb-5 h-1/6">
                    <h3 class="text-xs mb-2" id='start'>{timeString(event.date)}</h3>
                </div>
        </div >
    )
};

export default WeeklyEventCard;
