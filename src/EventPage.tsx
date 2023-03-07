import type { Component } from 'solid-js';

const EventPage: Component<{}> = () => {
	return <div class="flex flex-row">
		<div class="flex-none" id="dashboard-left">
			Dashboard
		</div>
		<div class="flex-1" id="content">
			<p>test</p>
		</div>
	</div>
};

export default EventPage
