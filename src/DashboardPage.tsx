import { Component, createSignal, onMount } from 'solid-js'

type Club = {
	id: string
	name: string
	description_text?: string
}

const ClubPage = (props: { club?: Club }) => {
	return (
		<div class="flex-grow flex flex-col bg-white p-8 rounded-lg shadow-md">
		{props.club ? (
			<>
			<div class="text-2xl font-bold mb-4">{props.club.name}</div>
			<div class="mb-4">
				<strong>Description: </strong> {props.club.description_text}
			</div>
			</>
		) : (
			<div>Please select a club</div>
		)}
		</div>
	)
}

const EventCreator: Component<{}> = () => {
	const [eventName, setEventName] = createSignal("");
	const [eventDescription, setEventDescription] = createSignal("");
  
	const handleSubmit = async () => {
	  const eventData = {
		name: eventName(),
		description: eventDescription(),
		start: Date.now(),
	  };
  
	  await fetch("http://localhost:3030/post_event", {
		method: "POST",
		headers: {
		  "Content-Type": "application/json",
		},
		body: JSON.stringify(eventData),
	  });
	};
  
	return (
		<div class="bg-white p-8 rounded-lg shadow-md">
		<h2 class="text-xl font-bold mb-4">Create Event</h2>
		<label class="block mb-4">
		  <span class="text-gray-700">Event Name</span>
		  <input
			type="text"
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			value={eventName()}
			onInput={(e) => setEventName((e.target as HTMLInputElement).value)}
		  />
		</label>
		<label class="block mb-4">
		  <span class="text-gray-700">Event Description</span>
		  <textarea
			class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
			value={eventDescription()}
			onInput={(e) => setEventDescription((e.target as HTMLInputElement).value)}
		  />
		</label>
		<button class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded" onClick={handleSubmit}>Submit</button>
	  </div>
	);
  };

const DashboardPage: Component<{}> = () => {
	const [club, setClub] = createSignal<Club>()
	onMount(() => {
		let clubID: string
		fetch(`http://localhost:3030/get_club_by_organizer/${global.userID}`)
			.then(response => response.json())
			.then(club => {
				clubID = club.club
				return fetch(`http://localhost:3030/get_clubs`)
				.then(response => response.json())
				.then(clubs => {
					return clubs.clubs.find((club: Club) => {
						return Number.parseInt(club.id) == Number.parseInt(clubID)
					})
				})
				.then(club => {
					console.log(club)
					setClub(club)
				})
			})
	})

	return (
		<>
		<div class="flex flex-wrap">
  <div class="w-full md:w-3/4 p-4">
    <div class="bg-white rounded-lg shadow-md p-4">
      <ClubPage club={club()} />
    </div>
  </div>
  <div class="w-full md:w-3/4 p-4">
    <div class="bg-white rounded-lg shadow-md p-4">
      <EventCreator />
    </div>
  </div>
</div>

		</>
	)
}

export default DashboardPage
