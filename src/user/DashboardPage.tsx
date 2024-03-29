import { Component, createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router'
import toast, { Toaster } from 'solid-toast';

import type { EventType, LocationType } from "../event/EventTypes"

type Club = {
  id: number;
  name: string;
  description_text?: string;
};

const ClubPage = (props: { club?: Club }) => {
  return (
    <div class="p-8 bg-white rounded-lg shadow-md">
      {props.club ? (
        <>
          <h2 class="text-xl font-bold mb-4">{props.club.name}</h2>
          <p class="text-gray-700">{props.club.description_text}</p>
        </>
      ) : (
        <p class="text-gray-700">Please select a club</p>
      )}
    </div>
  );
};

const EventCreator = (props: { clubID?: number }) => {
  const [eventName, setEventName] = createSignal('');
  const [eventDescription, setEventDescription] = createSignal('');
  const [meetingLocation, setMeetingLocation] = createSignal('');
  const [startTime, setStartTime] = createSignal('');
  const navigate = useNavigate()

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // let location: LocationType = await (await fetch('/get_or_create_location', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     description: meetingLocation(),
    //   }),
    // })).json();

    // await fetch('/post_event', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     club_id: props.clubID,
    //     location_id: location.id,
    //     name: eventName(),
    //     description: eventDescription(),
    //     start: new Date(startTime()).getTime(),
    //     categories: [],
    //     is_recurring: false,
    //   }),
    // });
    console.log("Bearer " + sessionStorage.getItem('token'))
    const resp = await fetch (`/api/post_event`, {
      method: "POST",
      // headers: {
      //   "Authorization": "Bearer " + sessionStorage.getItem('token'),
      //   "Content-Type": "application/json"
      // },
      body: JSON.stringify({
        event: {
          org_id: "99",
          name: eventName(),
          description: eventDescription(),
          location: meetingLocation(),
          date: new Date(startTime()).toISOString(),
          photo_url: "",
          is_recurring: false,
          uid: sessionStorage.getItem('uid')
        }
     })
    })

    const results = await resp.json()
    console.log(resp)
    console.log(results)
    if(resp.status != 200) {
      toast.error(results)
      return
    }

    
    toast.success('Event Submitted')
    
    setEventName('');
    setEventDescription('');
    setMeetingLocation('');
    setStartTime('');
    navigate("/")
  };

  return (
    <div class="p-8 bg-white rounded-lg shadow-md mt-8">
      <Toaster position="top-center" />
      <h2 class="text-xl font-bold mb-4">Create Event</h2>
      <form>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">
            Event Name
            <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={eventName()}
              onInput={(e) => setEventName((e.target as HTMLInputElement).value)}
            />
          </label>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">
            Event Description
            <textarea
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={eventDescription()}
              onInput={(e) =>
                setEventDescription((e.target).value)
              }
            />
          </label>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">
            Meeting Location
            <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={meetingLocation()}
              onInput={(e) =>
                setMeetingLocation((e.target as HTMLInputElement).value)
              }
            />
          </label>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-bold mb-2">
            Start Time
            <input
              class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="datetime-local"
              value={startTime()}
              onInput={(e) =>
                setStartTime((e.target as HTMLInputElement).value)
              }
            />
          </label>
        </div>
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
          type="button"
          onClick={() => {
            setEventName('');
            setEventDescription('');
            setMeetingLocation('');
            setStartTime('');
          }}
        >
          Clear
        </button>
      </form>
    </div>
  );
};

const DashboardPage: Component<{}> = () => {
  const [club, setClub] = createSignal<Club>();
  const [clubID, setClubID] = createSignal<number>(0);
  const navigate = useNavigate()

  // onMount(() => {
  //   fetch(`/get_club_by_organizer/${global.userID}`)
  //     .then((response) => response.json())
  //     .then((club) => {
  //       setClubID(club.club);
  //       return fetch(`/get_clubs`)
  //         .then((response) => response.json())
  //         .then((clubs) => {
  //           return clubs.clubs.find((club: Club) => {
  //             return club.id === clubID();
  //           });
  //         })
  //         .then((club) => {
  //           console.log(club);
  //           setClub(club);
  //         });
  //     });
  // });

  return (
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <EventCreator clubID={clubID()} />
    </div>
    // <div class="bg-white min-h-screen flex flex-col">
    //   {/* <header class="bg-blue-600 shadow text-white">
    //     <div class="container mx-auto px-4 py-2">
    //       <h1 class="text-3xl font-bold">Dashboard</h1>
    //     </div>
    //   </header> */}
    //   <main class="flex-grow container mx-auto py-8">
    //     <div class="flex flex-wrap -mx-4">
    //       {/* <div class="w-full md:w-3/4 p-4">
    //         <ClubPage club={club()} />
    //       </div> */}
    //       <div class="w-full md:w-1/4 p-4">
    //         <EventCreator clubID={clubID()} />
    //       </div>
    //     </div>
    //   </main>
    // </div>
  );
};

export default DashboardPage;

