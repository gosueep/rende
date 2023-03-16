import { Component, createSignal, onMount } from 'solid-js'

type Club = {
	id: string
	name: string
	meetingTime?: string
	description?: string
}

type ClubsListProps = {
	clubs: Club[]
	onSelectClub: (club: Club) => void
}

const ClubsList = (props: ClubsListProps) => {
	const [selectedClub, setSelectedClub] = createSignal<Club>({ id: '1', name: 'test', meetingTime: 'test', description: 'test' })

	const handleSelectClub = (club: Club) => {
		setSelectedClub(club)
		props.onSelectClub(club)
	}

	return (
		<div class="flex-grow flex flex-col bg-gray-200 p-4">
			<div class="text-2xl font-bold mb-4"> Home </div>
			{props.clubs.map(club => (
				<div
					class={`bg-white rounded-lg shadow-lg p-4 mb-4 ${selectedClub() && selectedClub().id === club.id ? 'bg-blue-100' : ''}`}
					onClick={() => handleSelectClub(club)}
				>
					{club.name}
				</div>
			))}
		</div>
	)
}

const ClubPage = (props: { club?: Club }) => {
	return (
		<div class="flex-grow flex flex-col bg-gray-300 p-4">
			{props.club ? (
				<>
					<div class="text-2xl font-bold mb-4">{props.club.name}</div>
					<div class="mb-4">
						<strong>Meeting time: </strong> {props.club.meetingTime}
					</div>
					<div class="mb-4">
						<strong>Description: </strong> {props.club.description}
					</div>
					<div class="flex flex-wrap">
						<div class="w-1/2 p-2">
							<img src="https://nyrevconnect.com/wp-content/uploads/2017/06/Placeholder_staff_photo-e1505825573317.png" alt="Image 1" class="w-full h-auto" />
						</div>
						<div class="w-1/2 p-2">
							<img src="https://nyrevconnect.com/wp-content/uploads/2017/06/Placeholder_staff_photo-e1505825573317.png" alt="Image 2" class="w-full h-auto" />
						</div>
						<div class="w-1/2 p-2">
							<img src="https://nyrevconnect.com/wp-content/uploads/2017/06/Placeholder_staff_photo-e1505825573317.png" alt="Image 3" class="w-full h-auto" />
						</div>
						<div class="w-1/2 p-2">
							<img src="https://nyrevconnect.com/wp-content/uploads/2017/06/Placeholder_staff_photo-e1505825573317.png" alt="Image 4" class="w-full h-auto" />
						</div>
					</div>
				</>
			) : (
				<div>Please select a club</div>
			)}
		</div>
	)
}

const DashboardPage: Component<{}> = () => {
	const [clubs, setClubs] = createSignal<Club[]>([])
	onMount(() => {
		fetch('http://localhost:3030/get_clubs')
			.then(response => response.json())
			.then(clubs => {
				console.log(clubs)
				setClubs(clubs)
			})

		// TODO how to add events
		fetch('http://localhost:3030/post_event', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				id: 1,
				name: "AWESOME EVENT!",
				description: "Come to this event for awesome shit!",
				start: 0,
			}),
		}).then(response => response.json())
			.then(event_id => {
				console.log(event_id)
			})
	})

	const [selectedClub, setSelectedClub] = createSignal<Club>()

	return (
		<div class="min-h-screen flex">
			<div class="w-full max-w-sm flex flex-col">
				<ClubsList clubs={clubs()} onSelectClub={setSelectedClub} />
			</div>
			<div class="flex-grow flex flex-col bg-gray-300 p-4">
				<ClubPage club={selectedClub()} />
			</div>
		</div>
	)
}

export default DashboardPage
