import { Component, createSignal, onMount } from 'solid-js';

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

  const handleSubmit = async (e: Event) => {
	e.preventDefault();
    const eventData = {
		id: 1,
		name: eventName(),
		club_id: props.clubID,
		description_text: eventDescription(),
		description_html: meetingLocation(),
		start: new Date(startTime()).getTime(),
	  };
  

	  await fetch('http://localhost:3030/post_event', {
		  method: 'POST',
		  headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify(eventData),
		});

    setEventName('');
    setEventDescription('');
    setMeetingLocation('');
    setStartTime('');
  };

  return (
    <div class="p-8 bg-white rounded-lg shadow-md mt-8">
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
                setEventDescription((e.target as HTMLInputElement).value)
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

  onMount(() => {
    fetch(`http://localhost:3030/get_club_by_organizer/${global.userID}`)
      .then((response) => response.json())
      .then((club) => {
        setClubID(club.club);
        return fetch(`http://localhost:3030/get_clubs`)
		.then((response) => response.json())
		.then((clubs) => {
		  return clubs.clubs.find((club: Club) => {
			return club.id === clubID();
		  });
		})
		.then((club) => {
		  console.log(club);
		  setClub(club);
		});
	});
});

return (
  <div class="bg-white min-h-screen flex flex-col">
	<header class="bg-blue-600 shadow text-white">
	  <div class="container mx-auto px-4 py-2">
		<h1 class="text-3xl font-bold">Dashboard</h1>
	  </div>
	</header>
	<main class="flex-grow container mx-auto py-8">
	  <div class="flex flex-wrap -mx-4">
		<div class="w-full md:w-3/4 p-4">
		  <ClubPage club={club()} />
		</div>
		<div class="w-full md:w-1/4 p-4">
		  <EventCreator clubID={clubID()}/>
		</div>
	  </div>
	</main>
	<footer class="bg-gray-200 mt-auto">
	  <div class="container mx-auto px-4 py-2 text-center">
		&copy; 2023 SolidJS Example Project
	  </div>
	</footer>
  </div>
);
};

export default DashboardPage;

